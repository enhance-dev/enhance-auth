import db from '@begin/data'
import { getAccounts } from '../../models/accounts.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req) {
  const token = req.query?.token

  if (!token){ return {location:'/login'} }

  const verifySession = await db.get({ table: 'session', key: token })
  const {linkUsed}=verifySession

  if (!verifySession || linkUsed) { return {location:'/login/link-used'} }

  await db.set({...verifySession, table: 'session', key: token, linkUsed: true })

  let accounts, account
  try {
    accounts = await getAccounts()
    account = accounts.find(i => i.email === verifySession.email)
  }
  catch (e) {
    console.log(e)
  }

  if (!account) { return {location:'/login'} }

  const { password: removePassword, ...sanitizedAccount } = account
  return {
    session: { authorized: { ...sanitizedAccount } },
    location: verifySession?.redirectAfterAuth || '/'
  }
}
