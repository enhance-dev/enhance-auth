import { getAccount, upsertAccount, validate } from '../../models/accounts.mjs'
import bcrypt from 'bcryptjs'

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
  const {password:_, ...sanitizedAccount} = result
  return {
    json: { account: sanitizedAccount }
  }
}

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
    const {password:_, ...sanitizedAccount} = account
    return {
      session: {...session, problems, account:sanitizedAccount },
      location: `/accounts/${account.key}`
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, account: removed, ...newSession } = session
  try {
    delete account.confirmPassword
    if (account.updatePassword){
      account.password = bcrypt.hashSync(account.password, 10)
    } else {
      const oldAccount = await getAccount(id)
      account.password = oldAccount.password
    }
    if (account.password==='') delete account.password
    await upsertAccount({ key: id, ...account })
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
