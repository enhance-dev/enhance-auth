import tiny from 'tiny-json-http'
import { getAccounts } from '../../models/accounts.mjs'
import oauthUrls from '../../auth/oauth-urls.mjs'

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
        session.account = appUser
        return {
          session,
          location: redirect
        }
      } else if (!newRegistration) {
        throw Error('user not found')
      } else {
        console.log('here')
        return {
          session: { ...session, redirectAfterAuth: redirect },
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
  const urls = oauthUrls()


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


