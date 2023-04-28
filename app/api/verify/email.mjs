import db from '@begin/data'
import arc from '@architect/functions'
import { getAccounts, upsertAccount } from '../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const token = req.query?.token
  const { authorized, unverified, ...newSession } = req.session

  if (token) {
    const verifySession = await db.get({ table: 'session', key: token })
    const { linkUsed } = verifySession

    if (!verifySession || linkUsed) return  { location: '/verify/used' };
 
    await db.set({ ...verifySession, table: 'session', key: token, linkUsed: true })
    let accounts = await getAccounts()
    let account = accounts.find(acct => verifySession.email === acct.email)

    if (!account) return { location: '/login' };

    account.verified = account.verified ? {...account.verified,email:true} : {email:true}
    account = await upsertAccount({ ...account })
    return {
      session: {},
      location: '/verify/success-email'
    }

  } else if (unverified) {
    let accounts = await getAccounts()
    let account = accounts.find(acct => unverified.email === acct.email )
    const accountVerified = account.verified?.email
    
    if (!account) return {location: '/login'};
    if (accountVerified) {
      return {
        session: {},
        location: '/verify/success-email'
      }
    } 

    const verifyToken = crypto.randomBytes(32).toString('base64')
    const { redirectAfterAuth = '/' } = req.session
    await arc.events.publish({
      name: 'verify-email',
      payload: { verifyToken, email: account.email, redirectAfterAuth }, 
    })
    return {
      session: {},
      location: '/verify/waiting-email'
    }

  } else if (authorized) {
    if (authorized.verified?.email===true){
      return {
        location: '/verify/success-email'
      }
    } else {
      return { location: '/verify/success-email' }
    }

  } else {
    return {
      location: '/login'
    }
  }
}
