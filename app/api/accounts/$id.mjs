// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getAccount, upsertAccount, validate } from '../../models/accounts.mjs'

/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {
  const session = req.session
  const authorized = session?.authorized ? session?.authorized : false
  const scopes = authorized?.scopes
  const admin = scopes?.includes('admin')
  if (!admin) {
    return {
      location: '/'
    }
  }

  
  if (req.session.problems) {
    let { problems, account, ...session } = req.session
    return {
      session,
      json: { problems, account }
    }
  }

  const id = req.pathParameters?.id
  const result = await getAccount(id)
  return {
    json: { account: result }
  }
}

/**
 * @type {EnhanceApiFn}
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

  // Validate
  let { problems, account } = await validate.update(req)
  if (problems) {
    return {
      session: {...session, problems, account },
      json: { problems, account },
      location: `/accounts/${account.key}`
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, account: removed, ...newSession } = session
  try {
    const result = await upsertAccount({ key: id, ...account })
    return {
      session: newSession,
      json: { account: result },
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
