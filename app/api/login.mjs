import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'
import bcrypt from 'bcryptjs'
import { getAccounts } from '../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */

export async function get(req) {
  const { problems, ...newSession } = req.session
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth })
  console.log('session in get', req.session)

  if (problems) {
    console.log('newSession', newSession)
    console.log('problems in get', problems)
    return {
      session: newSession,
      json: { problems }
    }
  }
  return {
    json: { githubOauthHref: href },
  }
}

export async function post(req) {
  const session = req?.session
  const traditional = !!(req.body.password || req.body.username)
  const magic = !!(!traditional && req.body.email)

  if (magic) {

    const sessionToken = crypto.randomBytes(32).toString('base64')
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const { redirectAfterAuth = '/' } = session

    // TODO: Sanitize this
    const email = req?.body?.email

    await arc.events.publish({
      name: 'auth-link',
      payload: { sessionToken, verifyToken, email, redirectAfterAuth },
    })

    return {
      session: {},
      html: '<div>Check the console for link</div>'
    }
  } else if (traditional) {
    const { password, username } = req.body
    const accounts = await getAccounts()
    const account = accounts.find(a => a.username === username)
    const match = account ? bcrypt.compareSync(password, account?.password) : false
    if (match) {
      const { password: hash, ...sanitizedAccount } = account
      return {
        session: { authorized: sanitizedAccount },
        location: '/auth/welcome'
      }
    } else {
      return {
        session: { ...session, problems: { form: 'incorrect username or password' } },
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

