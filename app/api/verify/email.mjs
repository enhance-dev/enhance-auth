import db from '@begin/data'
import { getAccounts, getAccount, upsertAccount } from '../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const token = req.query?.token
  const { authorized, unverified, ...newSession } = req.session

  if (token) {
    const verifySession = await db.get({ table: 'session', key: token })
    const { linkUsed = false } = verifySession
    if (verifySession && !linkUsed) {
      await db.set({ ...verifySession, table: 'session', key: token, linkUsed: true })
      let accounts = await getAccounts()
      let account = accounts.find(acct => verifySession.email === acct.email)
      if (account) {
        account = await upsertAccount({ ...account, emailVerified: true })
        return {
          session: { redirectAfterAuth: verifySession?.redirectAfterAuth,/* emailVerified: true*/ },
          location: '/verify/success'
        }
      } else {
        return // waiting to verify message
      }
    }
  } else if (authorized) {
    return {
      location: '/'
    }
  } else if (unverified) {
    let accounts = await getAccounts()
    let account = accounts.find(acct => unverified.email === acct.email && acct.emailVerified === true)
    if (account) {
      let { password, ...sanitizedAccount } = account
      return {
        session: { authorized: sanitizedAccount },
        location: '/'
      }
    } else {
      return // waiting to verify message
    }
  } else {
    return {
      //session: { emailVerified: false, },
      location: '/login'
    }
  }
}

