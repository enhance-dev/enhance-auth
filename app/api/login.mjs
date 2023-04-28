import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'
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
  const traditional = !!(req.body.password || req.body.displayName)
  const magic = !!(!traditional && req.body.email)
  const { redirectAfterAuth = '/' } = session

  if (magic) {
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const email = req.body.email
    await arc.events.publish({
      name: 'auth-link',
      payload: { verifyToken, email, redirectAfterAuth },
    })
    return {
      session: {},
      location: 'login/wait-link'
    }
  } 

  if (traditional) {
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
        session: { problems: { form: 'Incorect Display Name or Password' }, login: displayName },
        location: '/login'
      }
    }
  }

  return {
    session: {},
    location: '/login'
  }

} 
