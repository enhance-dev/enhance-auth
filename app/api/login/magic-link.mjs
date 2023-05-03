import crypto from 'crypto'
import db from '@begin/data'
import sgMail from '@sendgrid/mail'
import { getAccounts } from '../../models/accounts.mjs'

export async function get(req) {
  const token = req.query?.token
  const { problems, login, ...newSession } = req.session
  if (problems) {
    return {
      session: newSession,
      json: { problems, login }
    }
  }

  if (!token) return

  if (token){
    const verifySession = await db.get({ table: 'session', key: token })
    const {linkUsed}=verifySession
    if (!verifySession || linkUsed) { return {location:'/login/link-expired'} }

    await db.set({...verifySession, table: 'session', key: token, linkUsed: true })

    let accounts, account
    try {
      accounts = await getAccounts()
      account = accounts.find(i => i.email === verifySession.email && i.authConfig?.loginAllowed?.includes('email-link'))
    }
    catch (e) {
      console.log(e)
    }

    if (!account) { return {location:'/login/magic-link'} }

    const accountVerified = account?.verified?.email

    const { password: removePassword, ...sanitizedAccount } = account

    if (!accountVerified) {
      return {
        session: {redirectAfterAuth:verifySession?.redirectAfterAuth || '/', 
          unverified: { ...sanitizedAccount } },
        location: '/verify'
      }
    }
    return {
      session: { authorized: { ...sanitizedAccount } },
      location: verifySession?.redirectAfterAuth || '/'
    }
  }

}

export async function post(req) {
  const session = req?.session
  const {email} = req.body
  const { redirectAfterAuth = '/' } = session

  if (!email){
    return {
      session: {...session, problems:{form:'No Email'}},
      location: '/login/magic-link'
    }
  } 

  if (email) {
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email && a.verified?.email && a.authConfig?.loginAllowed?.includes('email-link'))
    if (!account) { 
      return { 
        session: { problems: { form: 'Invalid Email' }, login: {email} },
        location: '/login/magic-link'
      }
    }
    await sendLink({ verifyToken, email, redirectAfterAuth })

    return {
      session: {},
      location: '/login/wait-link'
    }
  } 
} 



async function sendLink({  verifyToken, email, redirectAfterAuth = '/', newRegistration = false }){
  const isLocal = process.env.ARC_ENV === 'testing'
  const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
  const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'

  await db.set({ table: 'session', key: verifyToken, verifyToken, email, redirectAfterAuth, newRegistration })

  if (isLocal) {
    console.log('Login Link: ', `${domain}/login/magic-link?token=${encodeURIComponent(verifyToken)}`)
  }


  if (requiredEnvs) {
    let toEmail = email
    if (isLocal) toEmail = process.env.TRANSACTION_SEND_EMAIL; 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: toEmail,
      from: `${process.env.TRANSACTION_SEND_EMAIL}`,
      subject: 'enhance-auth-magic-link',
      text: `${domain}/login/magic-link?token=${encodeURIComponent(verifyToken)}`
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
