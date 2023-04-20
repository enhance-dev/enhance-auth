import db from '@begin/data'
import { getAccounts } from '../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const token = req.query?.token
  const verifySession = await db.get({ table: 'session', key: token })

  const { sessionToken, linkUsed = false } = verifySession
  let sessionInfo
  if (sessionToken && !linkUsed) {
    await db.set({ table: 'session', key: token, linkUsed: true })
    sessionInfo = await db.get({ table: 'session', key: sessionToken })

    if (sessionInfo?.newRegistration) {
      return {
        session: { redirectAfterAuth: sessionInfo?.redirectAfterAuth, verifiedEmail: sessionInfo?.email },
        location: '/auth/register'
      }
    }
    let accounts, account
    try {
      accounts = await getAccounts()
      account = accounts.find(i => i.email === sessionInfo.email)
    }
    catch (e) {
      console.log(e)
    }
    if (!account) {
      try {
        const allowList = await import('../../models/auth/allow-list.mjs')
        account = allowList.default.find(i => i.email === sessionInfo.email)
      }
      catch (e) {
        console.log('no allow list found')
      }
    }

    if (account) {
      // Verified Account
      return {
        session: { account },
        location: sessionInfo?.redirectAfterAuth
      }
    }
  }
  else if (sessionToken && linkUsed) {
    return {
      // Link already used
      location: '/login'
    }
  }
  return {
    location: '/login'
  }
}

