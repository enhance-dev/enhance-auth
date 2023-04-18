import crypto from 'crypto'
import arc from '@architect/functions'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function post (req) {
  const session = req?.session

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
}
