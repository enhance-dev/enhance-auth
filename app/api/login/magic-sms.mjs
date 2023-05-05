import twilio from "twilio"
import { getAccounts } from "../../models/accounts.mjs"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
const isLocal = process.env.ARC_ENV === 'testing'
const requiredEnvs = (process.env.TWILIO_API_ACCOUNT_SID && process.env.TWILIO_API_TOKEN)

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

    let service
    if (requiredEnvs){
      const toPhone = isLocal ? process.env.SMS_TEST_PHONE : '+1'+phone.replace('-','')
      const client = twilio(accountSid, authToken)
      service = await client.verify.v2.services.create({
        friendlyName: 'Enhance Auth Demo',
      });
      await client.verify.v2.services(service.sid).verifications.create({
        to: toPhone, 
        channel: 'sms',
      }); 

      if (!process.env.SMS_TEST_PHONE) console.log('Warning: SMS messages will be sent to phone numbers unless SMS_TEST_PHONE is set');
    } else {
      console.log('Missing required environment variables')
      if (isLocal){
        console.log('Use similated One Time Password "123456" for testing')
        service = {sid:'simulated-testing'}
      } 
    }

    let newSession = { ...req.session }
    newSession.smsCodeLogin = {...smsCodeLogin, serviceSid: service.sid }
    newSession.smsCodeLogin.phone=phone
    const { password: removePassword, ...sanitizedAccount } = account
    newSession.smsCodeLogin.account=sanitizedAccount

    return {
      session: newSession,
      location: '/login/magic-sms'
    }
  } 

  if (smsCode) {
    const { serviceSid } = smsCodeLogin

    let verification, status
    if (requiredEnvs){
      const toPhone = isLocal ? process.env.SMS_TEST_PHONE : '+1'+ phone.replace('-','')
      const client = twilio(accountSid, authToken)
      verification= await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: toPhone, code: smsCode })
      status = verification.status
    } else {
      console.log('Missing required environment variables')
      if (isLocal){ status = smsCode === '123456' ? 'approved' : false } 
    }

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
