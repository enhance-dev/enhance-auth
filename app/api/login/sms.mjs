import twilio from "twilio"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
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
    newSession.smsCodeLogin.otp = { serviceSid: service.sid }

    return {
      session: newSession,
      location: '/login/sms'
    }
  } 
  if (otpCode) {
    const { serviceSid } = otp
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: process.env.SMS_SEND_PHONE, code: otpCode })
    const status = verificationCheck.status
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
