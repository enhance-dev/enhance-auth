import { validator } from '@begin/validator'
import { Register } from './schemas/register.mjs'
import { getAccounts } from '../models/accounts.mjs'

const validate = {
  shared(req) {
    return validator(req, Register)
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
      problems['email'] = { errors: `<p>Email or Phone required</>` }
      problems['phone'] = { errors: `<p>Email or Phone required</>` }
    }
   

    const matchEmail = accounts.find(account => account.email === req.body.email)
    if (matchEmail) {
      valid = false
      problems['email'] = { errors: `<p>Email already registered</>` }
    }
    const matchPhone = accounts.find(account => account.phone === req.body.phone)
    if (matchPhone) {
      valid = false
      problems['phone'] = { errors: `<p>Phone already registered</>` }
    }
    const matchDisplayName = accounts.find(account => account.displayName === req.body.displayName)
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
