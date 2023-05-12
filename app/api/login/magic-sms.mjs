import {sendCode, verifyCode} from '../../auth-shared/sms-code-verify.mjs'
import { getAccounts } from "../../models/accounts.mjs"

export async function get(req) {
  const { smsCodeLogin } = req.session
  const { problems, login, ...newSession } = req.session

  if (problems) {
    return {
      session: newSession,
      json: { problems, login }
    }
  }

  return {
    session: newSession,
    json: { smsCodeLogin:!!smsCodeLogin }
  }
}

export async function post(req) {
  const retry = req.query.retry !==undefined
  const session = req.session
  const {smsCode, phone} = req.body
  const { smsCodeLogin = {}, redirectAfterAuth='/' } = session

  if (retry) {
    return {
      session: {},
      location: '/login/magic-sms'
    }
  }
  if (!phone && !smsCode){
    return {
      location: '/login/magic-sms'
    }
  }
  if (phone) {
    const accounts = await getAccounts()
    const account = accounts.find(a=>a.verified.phone && a.phone===phone  && a.authConfig?.loginAllowed?.includes('sms-code'))
    if (!account) {
      // To avoid inumeration of phone numbers
      return {
        session: {smsCodeLogin:'invalid-phone'},
        location: '/login/magic-sms'
      }
    }

    const serviceSid = await sendCode({phone, friendlyName:'Enhance Auth Login Code'})

    let newSession = { ...req.session }
    newSession.smsCodeLogin = {...smsCodeLogin, serviceSid }
    newSession.smsCodeLogin.phone=phone
    const { password: removePassword, ...sanitizedAccount } = account
    newSession.smsCodeLogin.account=sanitizedAccount

    return {
      session: newSession,
      location: '/login/magic-sms'
    }
  } 

  if (smsCode) {
    const status = await verifyCode({phone, serviceSid:smsCodeLogin.serviceSid, smsCode})
    if (status === 'approved') {
      let { smsCodeLogin, redirectAfterAuth='/', ...newSession } = req.session
      let { account } = smsCodeLogin
      if (!account) {
        return {
          session:{},
          location: '/login/magic-sms'
        }
      }
      return {
        session: { ...newSession, authorized:account },
        location: redirectAfterAuth
      }
    } else {
      return {
        location: '/login/magic-sms'
      }
    }
  } 
}
