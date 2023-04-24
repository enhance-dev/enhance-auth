const accountSid = process.env.TWILIO_API_ACCOUNT_SID;
const authToken = process.env.TWILIO_API_TOKEN;
import twilio from "twilio"
/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const { checkMultiFactor } = req.session
  const { otp } = checkMultiFactor

  if (!checkMultiFactor) {
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
  const { otp } = req.session.checkMultiFactor
  const client = twilio(accountSid, authToken)

  if (request) {
    const service = await client.verify.v2.services.create({
      friendlyName: 'My Verify Service',
    });

    const verification = await client.verify.v2.services(service.sid).verifications.create({
      to: process.env.SMS_SEND_PHONE,
      channel: 'sms',
    });

    const newSession = { ...req.session }
    newSession.checkMultiFactor.otp = { serviceSid: service.sid }

    return {
      session: newSession,
      location: '/auth/otp'
    }
  } else if (otpCode) {
    const { serviceSid } = otp
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: process.env.SMS_SEND_PHONE, code: otpCode })
    const status = verificationCheck.status
    if (status === 'approved') {
      let { checkMultiFactor, ...newSession } = req.session
      let { otp, ...authorized } = checkMultiFactor
      const redirectAfterAuth = req.session.redirectAfterAuth || '/'
      return {
        session: { ...newSession, authorized },
        location: redirectAfterAuth
      }
    } else {
      return {
        location: '/auth/otp'
      }
    }
  } else {
    return {
      location: '/auth/otp'
    }
  }
}
