import twilio from "twilio"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
const isLocal = process.env.ARC_ENV === 'testing'
const requiredEnvs = (process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY && process.env.SMS_SEND_PHONE)
/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const { smsCodeLogin } = req.session
  const {otp, phone } = smsCodeLogin

  if (!smsCodeLogin && !phone) {
    return {
      location: '/login'
    }
  }
  return {
    json: { otpSent: !!(otp?.serviceSid) },
  }
}

export async function post(req) {
  const { otpCode, request } = req.body
  const { smsCodeLogin } = req.session
  const { otp, phone } = smsCodeLogin

  if (request && phone) {

    let service
    if (requiredEnvs){
      const client = twilio(accountSid, authToken)
      service = await client.verify.v2.services.create({
        friendlyName: 'My Verify Service',
      });
      await client.verify.v2.services(service.sid).verifications.create({
        to: isLocal ? process.env.SMS_SEND_PHONE : phone,
        channel: 'sms',
      });
    } else {
      console.log('Missing required environment variables')
      if (isLocal){
        console.log('Use similated One Time Password "123456" for testing')
        service = {sid:'simulated-testing'}
      } 
    }

    const newSession = { ...req.session }
    newSession.smsCodeLogin.otp = { serviceSid: service.sid }

    return {
      session: newSession,
      location: '/login/sms'
    }
  } 
  if (otpCode) {
    const { serviceSid } = otp

    let verification, status
    if (requiredEnvs){
      const client = twilio(accountSid, authToken)
      verification= await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: process.env.SMS_SEND_PHONE, code: otpCode })
      status = verification.status
    } else {
      console.log('Missing required environment variables')
      if (isLocal){ status = otpCode === '123456' ? 'approved' : false } 
    }

    if (status === 'approved') {
      let { smsCodeLogin, ...newSession } = req.session
      let { otp, account } = smsCodeLogin
      const redirectAfterAuth = req.session.redirectAfterAuth || '/'
      return {
        session: { ...newSession, authorized:account },
        location: redirectAfterAuth
      }
    } else {
      return {
        location: '/login/sms'
      }
    }
  } 
  return {
    location: '/login/sms'
  }
}
