import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'
import { validate } from '../models/register.mjs'
import { getAccounts, upsertAccount } from '../models/accounts.mjs'

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
  let { authorized: removedAuthorize, problems: removedProblems, register: removedRegister, ...newSession } = session

  let { problems, register } = await validate.create(req)

  const accounts = await getAccounts()

  const matchEmail = accounts.find(account => account.email === register.email)
  if (matchEmail) {
    if (!problems) {
      problems = { email: { errors: '<p>Email already registered</p>' } }
    } else {
      problems.email = { errors: `<p>Email already registered</>` }
    }
  }
  const matchDisplayName = accounts.find(account => account.displayName === register.displayName)
  if (matchDisplayName) {
    if (!problems) {
      problems = { displayName: { errors: `<p>Display name already registered</p>` } }
    } else {
      problems.displayName = { errors: `<p>Display name already registered</p>` }
    }
  }

  if (problems) {
    let { password, confirmPassword, ...sanitizedRegister } = register
    return {
      session: { ...newSession, problems, register: sanitizedRegister },
      location: '/register'
    }
  }


  try {
    delete register.confirmPassword
    register.password = bcrypt.hashSync(register.password, 10)
    const { password: removePassword, ...newAccount } = await upsertAccount({ ...register, emailVerified: false })


    const sessionToken = crypto.randomBytes(32).toString('base64')
    const verifyToken = crypto.randomBytes(32).toString('base64')
    const { redirectAfterAuth = '/' } = session

    await arc.events.publish({
      name: 'verify-email',
      payload: { sessionToken, verifyToken, email: register.email, redirectAfterAuth, newRegistration: true },
    })

    return {
      session: { ...newSession, unverified: newAccount },
      location: '/verify/email'
    }
  }
  catch (err) {
    console.log(err)
    return {
      session: { ...newSession, error: err.message },
      location: '/register'
    }
  }

}

