import { validator } from '@begin/validator'
import { Forgot } from './schemas/forgot.mjs'

const validate = {
  shared(req) {
    return validator(req, Forgot)
  },
  async update(req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.confirmPassword !== req.body.password) {
      valid = false
      problems['confirmPassword'] = { errors: '<p>passwords should match</p>' }
    }
    return !valid ? { problems, newPassword: data.password } : { newPassword: data.password }
  }
}

export {
  validate
}
