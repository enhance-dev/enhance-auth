import { sendCode } from "../../auth-shared/sms-code-verify.mjs"
import { getAccount, upsertAccount } from "../../models/accounts.mjs"

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const { smsVerify, unverified, authorized } = req.session
  const {otp } = smsVerify || {}
  const phoneVerified = authorized?.verified?.phone || unverified?.verified?.phone

  if (!authorized && !unverified) {
    return {
      location: '/login'
    }
  }
  if (phoneVerified) {
    return {
      location:'/verify/success-phone'
    }
  }
  return {
    json: { otpSent: !!(otp?.serviceSid) },
  }
}

export async function post(req) {
  const { otpCode, request } = req.body
  const { smsVerify, unverified, authorized} = req.session
  const { otp } = smsVerify || {} 
  const phoneVerified = authorized?.verified?.phone || unverified?.verified?.phone
  const phone= authorized?.phone || unverified?.phone

  if (request && phone) {

    const serviceSid = sendCode({phone, friendlyName:'Enhance Auth Verify Phone'})
    const newSession = { ...req.session }
    newSession.smsVerify = {otp:{ serviceSid }}

    return {
      session: newSession,
      location: '/verify/phone'
    }
  } 
  if (otpCode) {
    const { serviceSid } = otp

    const status = verifyCode({phone, serviceSid, smsCode:otpCode})

    if (status === 'approved') {
      let { smsVerify, unverified, authorized, ...newSession } = req.session
      let key = authorized?.key || unverified?.key
      let account = await getAccount(key)
      let match = account?.phone === phone
      let verified = account?.verified
      if (!match) {
        return {
          session: {},
          location: '/login'
        }
      }
      
      if (verified) {
        account.verified.phone = true
      } else {
        account.verified = {phone:true}
      }

      if (match) {
        let result = await upsertAccount(account)
        let {password:removePassword, ...newAccount} = result

        const redirectAfterAuth = req.session.redirectAfterAuth || '/'
        return {
          session: { ...newSession, authorized:newAccount },
          location: redirectAfterAuth
        }
      } 
    } 
  } 
  return {
    location: '/verify/phone'
  }
}
