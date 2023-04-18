// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getAccount, upsertAccount, validate } from '../../models/accounts.mjs'
import { checkAuth } from '../../models/auth/auth-check.mjs'

/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {
  const admin = checkAuth(req, 'admin')
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
  const admin = checkAuth(req, 'admin')
  if (!admin) {
    return {
      statusCode: 401
    }
  }

  
  const id = req.pathParameters?.id

  const session = req.session
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
