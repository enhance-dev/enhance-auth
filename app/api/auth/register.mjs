/**
  * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
  */
import bcrypt from 'bcryptjs'
import { getAccounts, upsertAccount, validate } from '../../models/accounts.mjs'

/**
 * @type {EnhanceApiFn}
 */
export async function get(req) {

  const session = req.session
  const { verifiedEmail, oauth, traditional } = session

  if (!verifiedEmail && !oauth && !traditional) {
    return {
      location: '/signup'
    }
  }

  if (session?.problems?.length) {
    let { problems, registration, ...session } = req.session
    return {
      session,
      json: { problems, registration, email: verifiedEmail, oauth, traditional }
    }
  }

  return {
    json: { email: verifiedEmail, oauth, traditional }
  }
}

/**
 * @type {EnhanceApiFn}
 */
export async function post(req) {
  const session = req.session
  const { verifiedEmail, oauth, traditional } = session
  console.log("register route session", session)
  if (!verifiedEmail && !oauth && !traditional) {
    return {
      location: '/signup'
    }
  }
  let newReq = req
  if (verifiedEmail) newReq.body.email = verifiedEmail;
  if (oauth) newReq.body.provider = oauth;
  newReq.body.roles = { role1: 'member', role2: '', role3: '' }
  // Validate
  // TODO: validate no exra 
  let { problems, account } = await validate.create(newReq)
  if (problems?.length) {
    return {
      session: { ...session, problems, registration: account },
      location: '/auth/register'
    }
  }

  try {
    const accounts = await getAccounts()

    let exists = false
    if (verifiedEmail) exists = accounts.find(dbAccount => dbAccount.email === verifiedEmail);
    if (oauth) exists = accounts.find(dbAccount => dbAccount.provider.github.login === oauth.github.login);
    if (traditional) exists = accounts.find(dbAccount => dbAccount.username === account.username);

    if (!exists) {
      // bcrypt encrypt password 
      const password = bcrypt.hashSync(account.password, 10)
      const { password: hash, ...newAccount } = await upsertAccount({ ...account, password })
      return {
        session: { authorized: newAccount },
        location: '/auth/welcome'
      }
    }
    else if (traditional) {
      problems.username.error = 'Username already exists'
      return {
        session: { ...session, problems, registration: { ...account, password: '' } },
        location: '/auth/register'
      }
    } else {
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
