import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import arc from '@architect/functions'
import loginHref from '../auth/login-href.mjs'
import { validate } from '../models/register.mjs'
import { upsertAccount } from '../models/accounts.mjs'

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

  if (problems) {
    // eslint-disable-next-line no-unused-vars
    let { password, confirmPassword, ...sanitizedRegister } = register
    return {
      session: { ...newSession, problems, register: sanitizedRegister },
      location: '/register'
    }
  }

  try {
    delete register.confirmPassword
    register.password = bcrypt.hashSync(register.password, 10)
    // eslint-disable-next-line no-unused-vars
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

