import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth-shared/login-href.mjs'
import bcrypt from 'bcryptjs'
import { getAccounts, upsertAccount } from '../models/accounts.mjs'

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
  const paswordLogin = !!(req.body.password || req.body.displayName)
  const emailLinkLogin = !!(!paswordLogin && req.body.email)
  const smsCodeLogin = !!(!paswordLogin && !emailLinkLogin && req.body.phone)
  const { redirectAfterAuth = '/' } = session

  if (emailLinkLogin) {
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const email = req.body.email
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email && a.verified.email)
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
    const account = accounts.find(a => a.phone === phone && a.verified.phone)
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

  if (paswordLogin) {
    const { password, displayName } = req.body
    const accounts = await getAccounts()
    const account = accounts.find(a => a.displayName === displayName)
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
