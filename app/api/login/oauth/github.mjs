import { getAccounts } from '../../../models/accounts.mjs'
import verifyOauth from '../../../auth-shared/oauth-verify-code.mjs'

export async function get(req) {
  const { redirectAfterAuth:sessionRedirectAfterAuth = '' } = req.session
  const { query: { code, state } } = req


  if (!code){
    return {
      location: '/login'
    }
  }

  if (code) {
    let redirectAfterAuth 
    try {
      if (state) {
        const parseState = JSON.parse(state)
        redirectAfterAuth = parseState.redirectAfterAuth
      }
    // eslint-disable-next-line no-empty
    } catch (e) { }
    const redirect = redirectAfterAuth || sessionRedirectAfterAuth || '/'
    try {
      const oauthAccount = await verifyOauth(code)
      if (!oauthAccount.oauth.github) throw Error('user not found')
      const accounts = await getAccounts()
      const appUser = accounts.find(a => 
        a.provider?.github?.login === oauthAccount?.oauth?.github?.login && 
        a.authConfig?.loginAllowed?.includes('github')
      )
      const { password: removePassword, ...sanitizedAccount } = appUser || {}
      const accountVerified = appUser?.verified?.phone || appUser?.verified?.email

      if (!appUser) {
        return {
          location: '/login'
        }
      }
      if (!accountVerified){
        return {
          session: { redirectAfterAuth: redirect, unverified:sanitizedAccount },
          location: '/verify'
        }
      }
      return {
        session:{authorized:sanitizedAccount},
        location: redirect
      }

    } catch (err) {
      return {
        statusCode: err.code,
        body: err.message
      }
    }

  } 
}


