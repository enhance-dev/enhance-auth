import db from '@begin/data'
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
    const linkExpired = verifySession?.ttl < Date.now()

    if (!verifySession || linkUsed || linkExpired) return  { location: '/verify/expired' };
 
    await db.set({ ...verifySession, table: 'session', key: token, linkUsed: true })
    let accounts = await getAccounts()
    let account = accounts.find(acct => verifySession.email === acct.email)

    if (!account) return { location: '/login' };

    account.verified = account.verified ? {...account.verified , email:true} : {email:true}
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

    const { redirectAfterAuth = '/' } = req.session
    
    await sendLink({ email: account.email, subject:'Enhance Auth Verify Email Link', linkPath:'/verify/email', redirectAfterAuth })

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

