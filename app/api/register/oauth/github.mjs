import { validate } from '../../../models/register-oauth.mjs'
import { getAccounts, upsertAccount } from '../../../models/accounts.mjs'
import verifyOauth from '../../../auth-shared/oauth-verify-code.mjs'

export async function get(req) {
  const session = req.session
  const { problems, redirectAfterAuth:sessionRedirectAfterAuth = '', oauthAccount } = session
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
    const redirect = redirectAfterAuth || sessionRedirectAfterAuth || '/'
    let oauthAccount
    try {
      oauthAccount = await verifyOauth(code)
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
    register.authConfig = { loginWith: {github:true, email:true, phone:true} }
    register.scopes = ['member']
    // eslint-disable-next-line no-unused-vars
    register.ttl = Date.now() + 24*60*60*1000
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


