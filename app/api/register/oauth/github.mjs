export async function get(req) {
  const session = req.session
  const oauth = session?.oauth

  if (session.problems) {
    let { problems, register, ...newSession } = session
    return {
      session: newSession,
      json: { problems, register, oauth: !!oauth}
    }
  }
  
  return {
    json: { oauth: !!oauth},
  }
}




import tiny from 'tiny-json-http'
import { getAccounts } from '../../../models/accounts.mjs'
const isLocal = process.env.ARC_ENV === 'testing'
const useMock = !process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET
const domain = isLocal ? process.env.DOMAIN_NAME || 'http://localhost:3333' : process.env.DOMAIN_NAME
let urls
if (isLocal && useMock) {
  urls = {
    authorizeUrl: `${domain}/_mock-oauth/login`,
    redirectUrl: `${domain}/login/oauth/github`,
    tokenUrl: `${domain}/_mock-oauth/token`,
    userInfoUrl: `${domain}/_mock-oauth/user`,
  }
} else {
  urls = {
    authorizeUrl: process.env.OAUTH_AUTHORIZE_URL,
    redirectUrl: `${domain}/login/oauth/github`,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
    userInfoUrl: process.env.OAUTH_USERINFO_URL,
  }
}

export async function get(req) {
  const { afterAuthRedirect = '', oauthAccount } = req.session
  const { query: { code, state } } = req


  if (!code && oauthAccount){
    return 
  }

  if (code) {
    let redirectAfterAuth, newRegistration
    try {
      if (state) {
        const parseState = JSON.parse(state)
        redirectAfterAuth = parseState.redirectAfterAuth
        newRegistration = parseState.newRegistration
      }
    // eslint-disable-next-line no-empty
    } catch (e) { }
    const redirect = redirectAfterAuth || afterAuthRedirect || '/'
    try {
      const oauthAccount = await oauth(code)
      if (!oauthAccount.oauth.github) throw Error('user not found')
      const accounts = await getAccounts()
      const appUser = accounts.find(a => a.provider?.github?.login === oauthAccount?.oauth?.github?.login)
      const accountVerified = account?.verified?.phone || account?.verified?.email

      if (appUser && !newRegistration) {
        const { password: removePassword, ...sanitizedAccount } = appUser
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
      } else if (!newRegistration) {
        throw Error('user not found')
      }
      
      if (newRegistration) {
        return {
          session: { oauthAccount, redirectAfterAuth: redirect, },
          location: '/login/oauth/github'
        }
      }

    } catch (err) {
      return {
        statusCode: err.code,
        body: err.message
      }
    }

  } 
}


async function oauth(code) {


  const data = {
    code,
    client_id: process.env.OAUTH_CLIENT_ID || '',
    client_secret: process.env.OAUTH_CLIENT_SECRET || '',
    redirect_uri: urls.redirectUrl,
  }
  let result = await tiny.post({
    url: urls.tokenUrl,
    headers: { Accept: 'application/json' },
    data
  })
  let token = result.body.access_token
  let userResult = await tiny.get({
    url: urls.userInfoUrl,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json'
    }
  })

  const providerUser = userResult.body
  return {
    oauth: { github: providerUser }
  }
}
