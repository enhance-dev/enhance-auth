import crypto from 'crypto'
import db from '@begin/data'
import sgMail from '@sendgrid/mail'
import bcrypt from 'bcryptjs'
import { getAccounts, upsertAccount } from '../models/accounts.mjs'
import { validate } from '../models/forgot.mjs'

export async function get(req) {
  const token = req.query?.token
  const {problems, ...newSession}= req.session
  if (!token && problems){
    let data = {problems}
    if (newSession?.resetPassword) data.resetPassword = newSession.resetPassword
    return{
      session: newSession,
      json: data
    }
  }

  if (token) {
    const verifySession = await db.get({ table: 'session', key: token })
    const linkUsed  = verifySession?.linkUsed
    if (verifySession && !linkUsed) {
      return {
        session: { resetPassword: { email: verifySession.email, token } },
        json: { resetPassword: true }
      }
      // Link Used
    } else if (verifySession && linkUsed) {
      return {
        session: newSession,
        json: { linkUsed: true }
      }
      // Link not valid
    } else {
      return {
        session: newSession,
        json: { linkInvalid: true }
      }
    }
  }
}


export async function post(req) {
  const session = req?.session
  const {problems:removeProblems, ...newSession} = session
  const { resetPassword } = session
  const { password, confirmPassword, email } = req.body

  // if email is posted generate a reset link
  if (email) {
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email)
    if (account) {
      const verifyToken = crypto.randomBytes(32).toString('base64')
      const { redirectAfterAuth = '/' } = session

      await sendLink({ verifyToken, email, redirectAfterAuth })

      return {
        session: {},
        location: '/forgot/link-sent'
      }
    }

  } else if (resetPassword && password && confirmPassword) {
    const resetEmail = resetPassword.email
    const { valid, problems, newPassword } = await validate.update(req)
    if (problems) {
      return {
        session:{...newSession, problems},
        location: '/forgot'
      }
    }
    const token = resetPassword.token

    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === resetEmail)
    if (account) {
      const verifySession = await db.get({ table: 'session', key: token })
      const { linkUsed = false } = verifySession
      // Valid Link Unused
      if (verifySession && !linkUsed) {
        await db.set({ ...verifySession, table: 'session', key: token, linkUsed: true })
        if (verifySession.email === resetEmail) {
          const hash = bcrypt.hashSync(newPassword, 10)
          await upsertAccount({ ...account, password: hash })
          return {
            session: {},
            location: '/forgot/success'
          }
        }
      }
    }
  } else {
    return {
      session: {},
      location: '/login'
    }
  }
}

async function sendLink({ verifyToken, email, redirectAfterAuth = '/', newRegistration = false }){
  const isLocal = process.env.ARC_ENV === 'testing'
  const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
  const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'

  await db.set({ table: 'session', key: verifyToken, verifyToken, 
    email, redirectAfterAuth, newRegistration, linkUsed:false})


  // Local Development Testing Setup
  if (isLocal) {
    console.log('Reset Password: ', `${domain}/forgot?token=${encodeURIComponent(verifyToken)}`)
  }

  if (requiredEnvs) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    let toEmail = email
    if(isLocal) toEmail = process.env.TRANSACTION_SEND_EMAIL;
    const msg = {
      to: toEmail,
      from: `${process.env.TRANSACTION_SEND_EMAIL}`,
      subject: 'enhance-auth-magic-link',
      text: `${domain}/forgot?token=${encodeURIComponent(verifyToken)}`
      //html: '<strong>This is HTML</strong>',
    }
    try {
      await sgMail.send(msg)
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log('TRANSACTION_SEND_EMAIL and SENDGRID_API_KEY needed to send')
  }
}
