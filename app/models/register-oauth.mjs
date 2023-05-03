import { validator } from '@begin/validator'
import { RegisterOauth } from './schemas/register-oauth.mjs'
import { getAccounts } from '../models/accounts.mjs'

const validate = {
  shared(req) {
    return validator(req, RegisterOauth)
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
    const matchDisplayName = req.body.displayName && accounts.find(account => account.displayName === req.body.displayName)
    if (matchDisplayName) {
      valid = false
      problems['displayName'] = { errors: `<p>Display name already registered</p>` }
    }

    return !valid ? { problems, register: data } : { register: data }
  }
}

export {
  validate
}
