import { validator } from '@begin/validator'
import { RegisterUsername } from './schemas/register-username.mjs'
import { getAccounts } from '../models/accounts.mjs'

const validate = {
  shared(req) {
    return validator(req, RegisterUsername)
  },
  async create(req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      valid = false
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    if (req.body.confirmPassword !== req.body.password) {
      valid = false
      problems['confirmPassword'] = { errors: '<p>passwords should match</p>' }
    }

    const accounts = await getAccounts()

    if (!req.body.phone && !req.body.email) {
      valid = false
      problems['email'] = { errors: `<p>Email or Phone required</p>` }
      problems['phone'] = { errors: `<p>Email or Phone required</p>` }
    }

    const matchEmail = req.body.email && accounts.find(account => account.email === req.body.email)
    if (matchEmail) {
      valid = false
      problems['email'] = { errors: `<p>Email already registered</p>` }
    }
    const matchPhone = req.body.phone && accounts.find(account => account.phone === req.body.phone)
    if (matchPhone) {
      valid = false
      problems['phone'] = { errors: `<p>Phone already registered</p>` }
    }
    const matchUsername = req.body.username && accounts.find(account => account.username === req.body.username)
    if (matchUsername) {
      valid = false
      problems['username'] = { errors: `<p>Username name already registered</p>` }
    }

    return !valid ? { problems, register: data } : { register: data }
  }
}

export {
  validate
}
