import tiny from 'tiny-json-http'
import { getAccounts } from '../../models/accounts.mjs'

export async function get(req) {
  const { afterAuthRedirect = '' } = req.session
  const {
    query: { code, state }
  } = req

  let oauthStateRedirect
  try {
    if (state) oauthStateRedirect = JSON.parse(state).redirectAfterAuth
    // eslint-disable-next-line no-empty
  } catch (e) { }
  const redirect = oauthStateRedirect || afterAuthRedirect || '/'
  if (code) {
    try {
      const oauthAccount = await oauth(code)
      if (!oauthAccount.oauth.user) throw Error('user not found')
      let session = { ...oauthAccount }
      const accounts = await getAccounts()
      const account = accounts.find(a => a.oauth?.github?.login === oauthAccount?.login)
      if (appUser) {
        session.account = appUser
      } else {
        throw Error('user not found')
      }
      return {
        session,
        location: redirect
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
  const useMock = process.env.ARC_OAUTH_USE_MOCK

  const data = { code }
  if (!useMock) {
    data.client_id = process.env.ARC_OAUTH_CLIENT_ID
    data.client_secret = process.env.ARC_OAUTH_CLIENT_SECRET
    data.redirect_uri = process.env.ARC_OAUTH_REDIRECT
  }
  let result = await tiny.post({
    url: process.env.ARC_OAUTH_TOKEN_URI,
    headers: { Accept: 'application/json' },
    data
  })
  let token = result.body.access_token
  let userResult = await tiny.get({
    url: process.env.ARC_OAUTH_USER_INFO_URI,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json'
    }
  })

  const providerUser = userResult.body
  return {
    oauth: { user: providerUser }
  }
}


