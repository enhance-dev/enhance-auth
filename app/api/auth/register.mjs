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
  const { verifiedEmail, oauth } = session

  if (!verifiedEmail && !oauth) {
    return {
      location: '/auth/signup'
    }
  }

  if (session?.problems?.length) {
    let { problems, registration, ...session } = req.session
    return {
      session,
      json: { problems, registration, email: verifiedEmail, oauth }
    }
  }

  return {
    json: { email: verifiedEmail, oauth }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post(req) {
  const session = req.session
  const { verifiedEmail, oauth } = session
  let newReq = req
  if (verifiedEmail) newReq.body.email = verifiedEmail;
  if (oauth) newReq.body.provider = oauth;
  newReq.body.roles = { role1: 'member', role2: '', role3: '' }
  // Validate
  let { problems, account } = await validate.create(newReq)
  if (problems?.length) {
    return {
      session: { ...session, problems, registration: account },
      location: '/auth/register'
    }
  }

  try {
    const accounts = await getAccounts()
    const exists = verifiedEmail ?
      accounts.find(dbAccount => dbAccount.email === verifiedEmail) :
      oauth ?
        accounts.find(dbAccount => dbAccount.provider.github.login === oauth.github.login) :
        false
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
