import crypto from 'crypto'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth, newRegistration: true })
  return {
    json: { githubOauthHref: href },
  }
}

export async function post(req) {
  const { registrationType } = req.body

  const session = req?.session

  if (registrationType === 'magicLink') {

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
  } else if (registrationType === 'traditional') {
    return {
      session: { traditional: true },
      location: '/auth/register'
    }
  }
}

