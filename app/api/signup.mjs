import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function post(req) {
  let { magic, social } = req.queryParams
  magic = magic === '' ? true : false
  social = social === '' ? true : false

  const session = req?.session

  const sessionToken = crypto.randomBytes(32).toString('base64')
  const verifyToken = crypto.randomBytes(32).toString('base64')
  const { redirectAfterAuth = '/' } = session

  const email = req?.body?.email

  await arc.events.publish({
    name: 'auth-link',
    payload: { sessionToken, verifyToken, email, redirectAfterAuth, newRegistration: true },
  })

  return {
    session: {},
    html: '<div>Check the console for link</div>'
  }
}

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth, newRegistration: true })
  return {
    json: { githubOauthHref: href },
  }
}
