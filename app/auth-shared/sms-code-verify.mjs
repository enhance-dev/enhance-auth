import twilio from "twilio"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
const isLocal = process.env.ARC_ENV === 'testing'
const requiredEnvs = (process.env.TWILIO_API_ACCOUNT_SID && process.env.TWILIO_API_TOKEN)

export async function sendCode({phone,friendlyName}){
  let service
  if (requiredEnvs){
    const toPhone = isLocal ? process.env.SMS_TEST_PHONE : '+1'+phone.replace('-','')
    const client = twilio(accountSid, authToken)
    service = await client.verify.v2.services.create({
      friendlyName,
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
  return service.sid
}

export async function verifyCode({phone, serviceSid, smsCode }){
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
  return status
}
