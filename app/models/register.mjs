import data from '@begin/data'
import { validator } from '@begin/validator'
import { Register } from './schemas/register.mjs'

const validate = {
  shared(req) {
    return validator(req, Register)
  },
  async create(req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    if (req.body.confirmPassword !== req.body.password) {
      problems['confirmPassword'] = { errors: '<p>passwords should match</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, register: data } : { register: data }
  }
}

export {
  validate
}
