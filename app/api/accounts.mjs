// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getAccounts, upsertAccount, validate } from '../models/accounts.mjs'
import { checkRole, accountInfo } from '../middleware/auth-middleware.mjs'
import send from '../middleware/send.mjs'

/**
 * @type {EnhanceApiFn}
 */
export const get = [checkRole('admin'), accountInfo, list, send]

export async function list(req) {

  const accounts = await getAccounts()
  if (req.session.problems) {
    let { problems, account, ...session } = req.session
    return {
      session,
      json: { problems, accounts, account }
    }
  }

  return {
    json: { accounts }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post(req) {
  const admin = checkAuth(req, 'admin')
  if (!admin) {
    return {
      statusCode: 401
    }
  }


  const session = req.session
  // Validate
  let { problems, account } = await validate.create(req)
  if (problems) {
    return {
      session: { ...session, problems, account },
      json: { problems, account },
      location: '/accounts'
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, account: removed, ...newSession } = session
  try {
    const result = await upsertAccount(account)
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
