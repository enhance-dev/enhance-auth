// View documentation at: https://enhance.dev/docs/learn/starter-project/api
import { deleteAccount } from '../../../models/accounts.mjs'
import { checkAuth } from '../../../models/auth/auth-check.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function post (req) {
  const admin = checkAuth(req, 'admin')
  if (!admin) {
    return {
      statusCode: 401
    }
  }

  
  const id = req.pathParameters?.id

  const session = req.session
  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, account: removed, ...newSession } = session
  try {
    await deleteAccount(id)
    return {
      session: newSession,
      json: null,
      location: '/accounts'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/accounts'
    }
  }
}
