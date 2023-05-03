import bcrypt from 'bcryptjs'
import loginHref from '../../auth-shared/login-href.mjs'
import { validate } from '../../models/register.mjs'
import { getAccounts, upsertAccount } from '../../models/accounts.mjs'

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth, newRegistration: true })

  if (req.session.problems) {
    let { problems, register, ...newSession } = req.session
    return {
      session: newSession,
      json: { problems, register }
    }
  }

  return {
    json: { githubOauthHref: href },
  }
}

export async function post(req) {
  const session = req?.session
  // eslint-disable-next-line no-unused-vars
  let { authorized: removedAuthorize, 
    problems: removedProblems, 
    register: removedRegister, 
    unverified: removedUnverified,
    oauth,
    ...newSession } = session

  let { problems, register } = await validate.create(req)

  if (problems) {
    // eslint-disable-next-line no-unused-vars
    let { password:removedPassword, confirmPassword:removedConfirm, ...sanitizedRegister } = register
    return {
      session: { ...newSession, oauth, problems, register: sanitizedRegister },
      location: '/register/account'
    }
  }

  try {

    if (oauth) {
      if (register.password) delete register.password;
      if (register.confirmPassword) delete register.confirmPassword;
      register.provider = {github:{login:oauth.github.login}}
      register.authConfig = { mfa:{ enabled:false, type:'sms' }, loginAllowed: ['oauth', 'email-link', 'sms-code'] }
      const accounts = await getAccounts()
      const exists = accounts.find(account=>oauth.github.login===account.provider.github.login)
      if (exists){
        return {
          session: { ...newSession, oauth, problems:{form:'<p>GitHub user already registered</p>'}, register },
          location: '/register/account'
        }
      }

    } else {
      if (!register.password) {
        let { password:removedPassword, confirmPassword:removedConfirm, ...sanitizedRegister } = register
        return {
          session: { ...newSession, problems:{form:'<p>Missing Password</p>'}, register: sanitizedRegister },
          location: '/register/account'
        }
      }
      delete register.confirmPassword
      register.password = bcrypt.hashSync(register.password, 10)
      register.authConfig = { mfa:{ enabled:false, type:'sms' }, loginAllowed: ['password', 'email-link', 'sms-code'] }
    }

    register.scopes = ['member']
    // eslint-disable-next-line no-unused-vars
    const { password: removePassword, ...newAccount } = await upsertAccount(register)

    return {
      session: { unverified: newAccount },
      location: '/welcome'
    }
  }
  catch (err) {
    console.log(err)
    return {
      session: { ...newSession, error: err.message },
      location: '/register/account'
    }
  }

}
