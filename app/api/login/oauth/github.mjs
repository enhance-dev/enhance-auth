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
  console.log('github login session',req.session)
  const { afterAuthRedirect = '' } = req.session
  const { query: { code, state } } = req
  console.log('query',req.query)


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
    console.log('state',state)
    const redirect = redirectAfterAuth || afterAuthRedirect || '/'
    try {
      const oauthAccount = await oauth(code)
      if (!oauthAccount.oauth.github) throw Error('user not found')
      const accounts = await getAccounts()
      const appUser = accounts.find(a => a.provider?.github?.login === oauthAccount?.oauth?.github?.login)
      const { password: removePassword, ...sanitizedAccount } = appUser || {}
      const accountVerified = appUser?.verified?.phone || appUser?.verified?.email
      console.log({appUser})
      console.log({oauthAccount})
      console.log({accountVerified})

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
