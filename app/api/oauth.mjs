import tiny from 'tiny-json-http'
import { getAccounts } from '../models/accounts.mjs'
const isLocal = process.env.ARC_ENV === 'testing'
const useMock = !process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET
const domain = isLocal ? process.env.DOMAIN_NAME || 'http://localhost:3333' : process.env.DOMAIN_NAME
let urls
if (isLocal || useMock) {
  urls = {
    authorizeUrl: `${domain}/auth/_mock/login`,
    redirectUrl: `${domain}/oauth`,
    tokenUrl: `${domain}/auth/_mock/token`,
    userInfoUrl: `${domain}/auth/_mock/user`,
  }
} else {
  urls = {
    authorizeUrl: process.env.OAUTH_AUTHORIZE_URL,
    redirectUrl: `${domain}/oauth`,
    tokenUrl: process.env.OAUTH_TOKEN_URL,
    userInfoUrl: process.env.OAUTH_USERINFO_URL,
  }
}

export async function get(req) {
  const { afterAuthRedirect = '' } = req.session
  const {
    query: { code, state }
  } = req

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
  if (code) {
    try {
      const oauthAccount = await oauth(code)
      if (!oauthAccount.oauth.github) throw Error('user not found')
      let session = { ...oauthAccount }
      const accounts = await getAccounts()
      const appUser = accounts.find(a => a.provider?.github?.login === oauthAccount?.oauth?.github?.login)
      if (appUser && !newRegistration) {
        const { password: hash, ...sanitizedAccount } = appUser
        if (appUser.authConfig?.mfa?.enabled) {
          return {
            session: { redirectAfterAuth: redirect, checkMultiFactor: sanitizedAccount },
            location: '/auth/otp'
          }
        }
        session.authorized = sanitizedAccount
        return {
          session,
          location: redirect
        }
      } else if (!newRegistration) {
        throw Error('user not found')
      } else {
        return {
          session: { ...session, redirectAfterAuth: redirect, },
          location: '/auth/register'
        }
      }

    } catch (err) {
      return {
        statusCode: err.code,
        body: err.message
      }
    }
  } else {
    return {
      location: '/login'
    }
  }
}


async function oauth(code) {


  const data = {
    code,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
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
