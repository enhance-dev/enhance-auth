import { getAccounts, upsertAccount, validate } from '../../models/accounts.mjs'
import bcrypt from 'bcryptjs'

export async function get(req) {
  const session = req.session
  const authorized = session?.authorized ? session?.authorized : false
  const scopes = authorized?.scopes
  const admin = scopes?.includes('admin')
  if (!admin) {
    return {
      location: '/'
    }
  }


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

export async function post(req) {
  const session = req.session
  const authorized = session?.authorized ? session?.authorized : false
  const scopes = authorized?.scopes
  const admin = scopes?.includes('admin')
  if (!admin) {
    return {
      status:401
    }
  }


  // Validate
  let { problems, account } = await validate.create(req)
  let { password:removedPassword, confirmPassword:removedConfirm, ...sanitizedAccount } = account
  if (problems) {
    return {
      session: { ...session, problems, account:sanitizedAccount },
      location: '/accounts'
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, account: removed, ...newSession } = session
  try {
    delete account.confirmPassword
    account.password = bcrypt.hashSync(account.password, 10)
    // eslint-disable-next-line no-unused-vars
    const { password: removePassword, ...newAccount } = await upsertAccount(account)

    return {
      session: newSession,
      location: '/accounts'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      location: '/accounts'
    }
  }
}
