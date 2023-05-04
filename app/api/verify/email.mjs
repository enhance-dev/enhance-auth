import db from '@begin/data'
import crypto from 'crypto'
import sgMail from '@sendgrid/mail'
import { getAccounts, upsertAccount } from '../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const token = req.query?.token
  const { authorized, unverified, ...newSession } = req.session

  if (token) {
    const verifySession = await db.get({ table: 'session', key: token })
    const { linkUsed } = verifySession

    if (!verifySession || linkUsed) return  { location: '/verify/expired' };
 
    await db.set({ ...verifySession, table: 'session', key: token, linkUsed: true })
    let accounts = await getAccounts()
    let account = accounts.find(acct => verifySession.email === acct.email)

    if (!account) return { location: '/login' };

    account.verified = account.verified ? {...account.verified , email:true} : {email:true}
    account = await upsertAccount({ ...account })
    return {
      session: {},
      location: '/verify/success-email'
    }

  } else if (unverified) {
    let accounts = await getAccounts()
    let account = accounts.find(acct => unverified.email === acct.email )
    const accountVerified = account.verified?.email
    
    if (!account) return {location: '/login'};
    if (accountVerified) {
      return {
        session: {},
        location: '/verify/success-email'
      }
    } 

    const verifyToken = crypto.randomBytes(32).toString('base64')
    const { redirectAfterAuth = '/' } = req.session
    await sendLink({ verifyToken, email: account.email, redirectAfterAuth })
    return {
      session: {},
      location: '/verify/waiting-email'
    }

  } else if (authorized) {
    if (authorized.verified?.email===true){
      return {
        location: '/verify/success-email'
      }
    } else {
      return { location: '/verify/success-email' }
    }

  } else {
    return {
      location: '/login'
    }
  }
}

async function sendLink({ verifyToken, email, redirectAfterAuth = '/', newRegistration = false }){
  const isLocal = process.env.ARC_ENV === 'testing'
  const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
  const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'

  await db.set({ table: 'session', key: verifyToken, verifyToken, email, redirectAfterAuth, newRegistration })

  if (isLocal) {
    console.log('Verify Email Link: ', `${domain}/verify/email?token=${encodeURIComponent(verifyToken)}`)
  }

  if (requiredEnvs) {
    let toEmail = email
    if (isLocal) toEmail = process.env.TRANSACTION_SEND_EMAIL; 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: toEmail,
      from: `${process.env.TRANSACTION_SEND_EMAIL}`,
      subject: 'Enhance Authentication Example Login',
      text: `Here is your link to login to the Enhance authentication example app ${domain}/verify/email?token=${encodeURIComponent(verifyToken)}`
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
