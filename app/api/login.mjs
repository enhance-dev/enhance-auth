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

    const sessionToken = crypto.randomBytes(32).toString('base64')
    const verifyToken = crypto.randomBytes(32).toString('base64')

    // TODO: Sanitize this
    const email = req.body.email

    await arc.events.publish({
      name: 'auth-link',
      payload: { sessionToken, verifyToken, email, redirectAfterAuth },
    })

    return {
      session: {},
      html: '<div>Check the console for link</div>'
    }
  } else if (traditional) {
    const { password, displayName } = req.body
    const accounts = await getAccounts()
    const account = accounts.find(a => a.displayName === displayName)
    const match = account ? bcrypt.compareSync(password, account?.password) : false
    if (match && account.emailVerified) {
      const { password: hash, ...sanitizedAccount } = account
      if (account.authConfig?.mfa?.enabled) {
        return {
          session: { redirectAfterAuth, checkMultiFactor: sanitizedAccount },
          location: '/auth/otp'
        }
      }
      return {
        session: { authorized: sanitizedAccount },
        location: redirectAfterAuth ? redirectAfterAuth : '/auth/welcome'
      }
    } else if (match && !account?.emailVerified) {
      try {
        const { password: removePassword, ...newAccount } = await upsertAccount({ ...register, emailVerified: false })


        const sessionToken = crypto.randomBytes(32).toString('base64')
        const verifyToken = crypto.randomBytes(32).toString('base64')
        const { redirectAfterAuth = '/' } = session

        await arc.events.publish({
          name: 'verify-email',
          payload: { sessionToken, verifyToken, email: register.email, redirectAfterAuth, newRegistration: true },
        })

        return {
          session: { unverified: newAccount },
          location: '/verify/email'
        }
      } catch (err) {
        console.log(err)
        return {
          session: { error: err.message },
          location: '/login'
        }
      }
    } else {
      return {
        session: { ...session, problems: { form: 'incorrect display name or password' }, login: displayName },
        location: '/login'
      }
    }
  } else {
    return {
      session: {},
      location: '/login'
    }
  }

}
