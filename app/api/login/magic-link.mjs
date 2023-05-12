import sendLink from '../../auth-shared/send-email-link.mjs'
import db from '@begin/data'
import { getAccounts } from '../../models/accounts.mjs'

export async function get(req) {
  const token = req.query?.token
  const { problems, login, ...newSession } = req.session
  if (problems) {
    return {
      session: newSession,
      json: { problems, login }
    }
  }

  if (!token) return

  if (token){
    const verifySession = await db.get({ table: 'session', key: token })
    const {linkUsed}=verifySession
    const linkExpired = verifySession?.ttl < Date.now()
    if (!verifySession || linkUsed || linkExpired) { return {location:'/login/link-expired'} }

    await db.set({...verifySession, table: 'session', key: token, linkUsed: true })

    let accounts, account
    try {
      accounts = await getAccounts()
      account = accounts.find(i => i.email === verifySession.email && i.authConfig?.loginAllowed?.includes('email-link'))
    }
    catch (e) {
      console.log(e)
    }

    if (!account) { return {location:'/login/magic-link'} }

    const accountVerified = account?.verified?.email

    const { password: removePassword, ...sanitizedAccount } = account

    if (!accountVerified) {
      return {
        session: {redirectAfterAuth:verifySession?.redirectAfterAuth || '/', 
          unverified: { ...sanitizedAccount } },
        location: '/verify'
      }
    }
    return {
      session: { authorized: { ...sanitizedAccount } },
      location: verifySession?.redirectAfterAuth || '/'
    }
  }

}

export async function post(req) {
  const session = req?.session
  const {email} = req.body
  const { redirectAfterAuth = '/' } = session

  if (!email){
    return {
      session: {...session, problems:{form:'No Email Address'}},
      location: '/login/magic-link'
    }
  } 

  if (email) {
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email && a.verified?.email && a.authConfig?.loginAllowed?.includes('email-link'))
    if (account) { 
      await sendLink({ email, subject:'Enhance Auth Login Link', linkPath:'/login/magic-link', redirectAfterAuth })
    }
    return {
      location: '/login/wait-link'
    }
  } 
} 

