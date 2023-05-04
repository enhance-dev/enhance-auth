import { validate } from '../../../models/register-oauth.mjs'
import { getAccounts, upsertAccount } from '../../../models/accounts.mjs'
import tiny from 'tiny-json-http'
const isLocal = process.env.ARC_ENV === 'testing'
const useMock = !process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET
const domain = isLocal ? process.env.DOMAIN_NAME || 'http://localhost:3333' : process.env.DOMAIN_NAME
let urls
if (isLocal && useMock) {
  urls = {
    authorizeUrl: `${domain}/_mock-oauth/login`,
    redirectUrl: `${domain}/oauth`,
    tokenUrl: `${domain}/_mock-oauth/token`,
    userInfoUrl: `${domain}/_mock-oauth/user`,
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
  const session = req.session
  const { problems, afterAuthRedirect = '', oauthAccount } = session
  const { query: { code, state } } = req

  if (!code){

    if (problems) {
      let { problems, register, ...newSession } = session
      return {
        session: newSession,
        json: { problems, register, oauthAccount:!!oauthAccount}
      }
    }
    return {
      json: { oauthAccount: !!oauthAccount},
    }
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
    if (!newRegistration) {
      return {
        session: { },
        location: '/register/oauth/github'
      }
    }
    const redirect = redirectAfterAuth || afterAuthRedirect || '/'
    let oauthAccount
    try {
      oauthAccount = await oauth(code)
    } catch (err) {
      console.log(err)
    }
    if (!oauthAccount?.oauth?.github) {
      return {
        session: {},
        location: '/register/oauth/github',
      }
    }
    const accounts = await getAccounts()
    const appUser = accounts.find(a => a.provider?.github?.login === oauthAccount?.oauth?.github?.login)
    const accountVerified = appUser?.verified?.phone || appUser?.verified?.email

    if (appUser) {
      return {
        session: {},
        location: '/register/oauth/github',
      }
    } 
      
    return {
      session: { oauthAccount, redirectAfterAuth: redirect, },
      location: '/register/oauth/github'
    }

  } 
}

export async function post(req) {
  const session = req?.session
  // eslint-disable-next-line no-unused-vars
  let { authorized: removedAuthorize, 
    problems: removedProblems, 
    register: removedRegister, 
    unverified: removedUnverified,
    oauthAccount,
    ...newSession } = session

  let { problems, register } = await validate.create(req)

  if (problems) {
    // eslint-disable-next-line no-unused-vars
    let { password:removedPassword, confirmPassword:removedConfirm, ...sanitizedRegister } = register
    return {
      session: { ...newSession, problems, oauthAccount, register: sanitizedRegister },
      location: '/register/oauth/github'
    }
  }

  try {
    register.provider = oauthAccount?.oauth
    register.authConfig = { mfa:{ enabled:false, type:'sms' }, loginAllowed: ['oauth', 'email-link', 'sms-code'] }
    register.scopes = ['member']
    // eslint-disable-next-line no-unused-vars
    const { password: removePassword, ...newAccount } = await upsertAccount(register)

    return {
      session: { unverified: newAccount },
      location: '/verify'
    }
  }
  catch (err) {
    console.log(err)
    return {
      session: { ...newSession, error: err.message },
      location: '/register/oauth/github'
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

  const {login, ...rest} = userResult.body
  return {
    oauth: { github: {login} }
  }
}
