import twilio from "twilio"
import { getAccount, upsertAccount } from "../../models/accounts.mjs"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const { smsVerify, unverified, authorized } = req.session
  const {otp } = smsVerify || {}
  const phoneVerified = authorized?.verified?.phone || unverified?.verified?.phone
  console.log(req.session)

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
  const client = twilio(accountSid, authToken)

  if (request && phone) {
    const service = await client.verify.v2.services.create({
      friendlyName: 'My Verify Service',
    });

    const verification = await client.verify.v2.services(service.sid).verifications.create({
      to: process.env.SMS_SEND_PHONE,
      channel: 'sms',
    });

    const newSession = { ...req.session }
    newSession.smsVerify = {otp:{ serviceSid: service.sid }}

    return {
      session: newSession,
      location: '/verify/sms'
    }
  } 
  if (otpCode) {
    const { serviceSid } = otp
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: process.env.SMS_SEND_PHONE, code: otpCode })
    const status = verificationCheck.status
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
    location: '/verify/sms'
  }
}
