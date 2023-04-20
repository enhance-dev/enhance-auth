// View documentation at: https://enhance.dev/docs/learn/starter-project/api
/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import { getAccounts, upsertAccount, validate } from '../../models/accounts.mjs'

/**
 * @type {EnhanceApiFn}
 */
export async function get(req) {
  const session = req.session
  const { verifiedEmail } = session

  if (!verifiedEmail) {
    return {
      location: '/auth/signup'
    }
  }

  if (session?.problems) {
    let { problems, account, ...session } = req.session
    return {
      session,
      json: { problems, account, email: verifiedEmail }
    }
  }

  return {
    json: { email: verifiedEmail }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post(req) {
  const session = req.session
  const verifiedEmail = session?.verifiedEmail
  let newReq = req
  newReq.body.email = verifiedEmail
  newReq.body.roles = { role1: 'member', role2: '', role3: '' }
  // Validate
  let { problems, account } = await validate.create(newReq)
  if (problems) {
    return {
      session: { ...session, problems, registration: account },
      json: { problems, registration: account, email: verifiedEmail },
      location: '/auth/register'
    }
  }

  try {
    const accounts = await getAccounts()
    const exists = accounts.find(dbAccount => dbAccount.email === verifiedEmail)
    if (!exists) {
      const newAccount = await upsertAccount(account)
      return {
        session: { account: newAccount },
        json: { account: newAccount },
        location: '/auth/welcome'
      }
    }
    else {
      // TODO: Add better error message. This should only happen if two people try to register the same account simultaneously.
      console.error('Account already registered with this email')
      return {
        session: {},
        location: '/signup'
      }
    }
  }
  catch (err) {
    console.log(err)
    return {
      session: { error: err.message },
      json: { error: err.message },
      location: '/auth/register'
    }
  }
}
