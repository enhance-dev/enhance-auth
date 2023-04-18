import data from '@begin/data'
import { validator } from '@begin/validator'
import { Account } from './schemas/account.mjs'

const deleteAccount = async function (key) {
  return data.destroy({ table: 'accounts', key })
}

const upsertAccount = async function (account) {
  return data.set({ table: 'accounts', ...account })
}

const getAccount = async function (key) {
  return data.get({ table: 'accounts', key })
}

const getAccounts = async function () {
  return data.get({ table: 'accounts' })
}

const validate = {
  shared (req) {
    return validator(req, Account)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, account: data } : { account: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
    return !valid ? { problems, account: data } : { account: data }
  }
}

export {
  deleteAccount,
  getAccount,
  getAccounts,
  upsertAccount,
  validate
}
