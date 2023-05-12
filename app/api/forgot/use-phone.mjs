import {sendCode, verifyCode} from '../../auth-shared/sms-code-verify.mjs'
import { getAccounts, upsertAccount } from '../../models/accounts.mjs'
import { validate } from '../../models/forgot.mjs'
import bcrypt from 'bcryptjs'

export async function get(req) {
  const { smsCodeReset } = req.session
  const { problems, forgot, ...newSession } = req.session

  if (problems) {
    return {
      session: newSession,
      json: { problems, forgot }
    }
  }

  let resetState 
  if (!smsCodeReset) { 
    resetState = 'request-phone'
  } else if (smsCodeReset?.resetVerified) { 
    resetState = 'reset'
  } else if (smsCodeReset){
    resetState = 'enter-code'
  }
  return {
    session: newSession,
    json: { smsCodeReset: resetState }
  }
}

export async function post(req) {
  const retry = req.query.retry !== undefined
  const session = req.session
  const {smsCode, phone, password, confirmPassword} = req.body
  const { smsCodeReset = {}, redirectAfterAuth='/' } = session

  if (retry) {
    return {
      session: {},
      location: '/forgot/use-phone'
    }
  }
  if (!phone && !smsCode && !password){
    return {
      location: '/forgot/use-phone'
    }
  }
  if (phone) {
    const accounts = await getAccounts()
    const account = accounts.find(a=>a.verified.phone && a.phone===phone 
      && a.authConfig?.loginAllowed?.includes('username'))
    if (!account) {
      // To avoid inumeration of phone numbers
      return {
        session: {},
        location: '/forgot/use-phone'
      }
    }

    const serviceSid = await sendCode({phone, friendlyName:'Enhance Auth Login Code'})

    let newSession = { ...req.session }
    const { password: removePassword, ...sanitizedAccount } = account
    newSession.smsCodeReset = {phone, serviceSid, account:sanitizedAccount }

    return {
      session: newSession,
      location: '/forgot/use-phone'
    }
  } 

  if (smsCode) {
    const status = await verifyCode({phone, serviceSid:smsCodeReset.serviceSid, smsCode})
    if (status === 'approved') {
      let { smsCodeReset, redirectAfterAuth='/', ...newSession } = req.session
      let { account } = smsCodeReset
      if (!account) {
        return {
          session:{},
          location: '/forgot/use-phone'
        }
      }
      return {
        session: { ...newSession, smsCodeReset:{...smsCodeReset, resetVerified:true} },
        location: '/forgot/use-phone'
      }
    } else {
      return {
        session: {},
        location: '/forgot/use-phone'
      }
    }
  } 

  if (smsCodeReset?.resetVerified && password && confirmPassword) {
    const resetPhone = smsCodeReset.phone
    const { valid, problems, newPassword } = await validate.update(req)
    if (problems) {
      return {
        session:{...newSession, problems},
        location: '/forgot/use-phone'
      }
    }
    const accounts = await getAccounts()
    const account = accounts.find(a => a.phone === resetPhone && a.verified.phone 
    && a.authConfig?.loginAllowed?.includes('username'))
    if (account) {
      const hash = bcrypt.hashSync(newPassword, 10)
      await upsertAccount({ ...account, password: hash })
      return {
        session: {},
        location: '/forgot/success'
      }
    }
  } else {
    return {
      session: {},
      location: '/login'
    }
  }
  return {
    session: {},
    location: '/forgot/use-phone'
  }
}
