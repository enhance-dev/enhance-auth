import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth-shared/login-href.mjs'
import bcrypt from 'bcryptjs'
import { getAccounts } from '../models/accounts.mjs'
// Hardcoded admin account to bootstrap accounts.
// The password is defined in environment variables
const hardcodedAdmin = {
  displayName: 'hardcoded',
  scopes: ['admin'],
}

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth })

  const { problems, login, ...newSession } = req.session
  if (problems) {
    return {
      session: newSession,
      json: { problems, login }
    }
  }
  return {
    json: { githubOauthHref: href },
  }
}

export async function post(req) {
  const session = req?.session
  const passwordLogin = !!(req.body.password || req.body.displayName)
  const emailLinkLogin = !!(!passwordLogin && req.body.email)
  const smsCodeLogin = !!(!passwordLogin && !emailLinkLogin && req.body.phone)
  const { redirectAfterAuth = '/' } = session

  if (emailLinkLogin) {
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const email = req.body.email
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email && a.verified?.email && a.authConfig?.loginAllowed?.includes('email-link'))
    if (!account) { 
      return { 
        session: { problems: { form: 'Invalid Email' }, login: {email} },
        location: '/login'
      }
    }
    await arc.events.publish({
      name: 'auth-link',
      payload: { verifyToken, email, redirectAfterAuth },
    })
    return {
      session: {},
      location: 'login/wait-link'
    }
  } 

  if (smsCodeLogin) {
    const phone = req.body.phone
    const accounts = await getAccounts()
    const account = accounts.find(a => a.phone === phone && a.verified.phone && a.authConfig?.loginAllowed?.includes('sms-code'))
    const { password: removePassword, ...sanitizedAccount } = account
    if (!account) { 
      return { 
        session: { problems: { form: 'Invalid Phone' }, login: {phone} },
        location: '/login'
      }
    }
    return {
      session: {smsCodeLogin:{phone, account:sanitizedAccount}},
      location: 'login/sms'
    }
  } 

  if (passwordLogin) {
    const { password, displayName } = req.body

    // Hardcoded admin account to bootstrap accounts
    // To disable remove the HARDCODED_ADMIN_PASSWORD from environment variables
    if (process.env.HARDCODED_ADMIN_PASSWORD && displayName === hardcodedAdmin.displayName  && password === process.env.HARDCODED_ADMIN_PASSWORD) {
      return {
        session: { authorized: hardcodedAdmin },
        location: '/accounts'
      }
    }

    let accounts = await getAccounts()
    const account = accounts.find(a => a.displayName === displayName && a.authConfig?.loginAllowed?.includes('password'))
    const match = account ? bcrypt.compareSync(password, account?.password) : false
    const accountVerified = match ? !!(account.verified?.email || account.verified?.phone) : false
    const mfa = account?.authConfig?.mfa?.enabled
    const { password: removePassword, ...sanitizedAccount } = account
    if (accountVerified) {
      if (mfa) {
        return {
          session: { redirectAfterAuth, checkMultiFactor: sanitizedAccount },
          location: '/auth/otp'
        }
      }
      return {
        session: { authorized: sanitizedAccount },
        location: redirectAfterAuth ? redirectAfterAuth : '/'
      }
    } 
    if (match && !accountVerified) {
      return {
        session: { unverified: sanitizedAccount },
        location: '/welcome'
      }
    }
    if (!match) {
      return {
        session: { problems: { form: 'Incorect Display Name or Password' }, login: {displayName} },
        location: '/login'
      }
    }
  }

  return {
    session: {},
    location: '/login'
  }

} 
