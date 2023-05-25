import bcrypt from 'bcryptjs'
import { validate } from '../../models/register-username.mjs'
import { upsertAccount } from '../../models/accounts.mjs'

export async function get(req) {
  let { problems, register, ...newSession } = req.session

  if (problems) {
    return {
      session: newSession,
      json: { problems, register }
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
    ...newSession } = session

  let { problems, register } = await validate.create(req)

  if (problems) {
    // eslint-disable-next-line no-unused-vars
    let { password:removedPassword, confirmPassword:removedConfirm, ...sanitizedRegister } = register
    return {
      session: { ...newSession, problems, register: sanitizedRegister },
      location: '/register/username'
    }
  }

  try {
    delete register.confirmPassword
    register.password = bcrypt.hashSync(register.password, 10)
    register.authConfig = { loginWith: {username:true, email:true, phone:true} }
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
      location: '/register/username'
    }
  }

}
