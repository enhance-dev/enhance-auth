// View documentation at: https://enhance.dev/docs/learn/starter-project/api
import { deleteAccount } from '../../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function post (req) {
  const session = req.session
  const authorized = session?.authorized ? session?.authorized : false
  const scopes = authorized?.scopes
  const admin = scopes?.includes('admin')
  if (!admin) {
    return {
      status:401
    }
  }

  
  const id = req.pathParameters?.id

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
