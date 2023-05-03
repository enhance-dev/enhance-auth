import db from '@begin/data'
import sgMail from '@sendgrid/mail'
import twilio from "twilio"
import { getAccount, upsertAccount } from "../../models/accounts.mjs"
const accountSid = process.env.TWILIO_API_ACCOUNT_SID
const authToken = process.env.TWILIO_API_TOKEN
const isLocal = process.env.ARC_ENV === 'testing'
const requiredEnvs = (process.env.TWILIO_API_ACCOUNT_SID && process.env.TWILIO_API_TOKEN)

export async function get(req){
  const session = req.session
  const { unverified, authorized, redirectAfterAuth = '/', ...restSession } = session 
  let phone,email,phoneVerified,emailVerified
  if (unverified) {
    phone = unverified.phone
    email = unverified.email
    phoneVerified = unverified.verified?.phone
    emailVerified = unverified.verified?.email
    const verifyPhone = phone && !phoneVerified
    const verifyEmail = email && !emailVerified
    if (verifyEmail){
      // send verification link
      const verifyToken = crypto.randomBytes(32).toString('base64')
      await sendLink({ verifyToken, email, redirectAfterAuth })
      if (!verifyPhone){
        return {
          session: {},
          location: '/verify/waiting-email'
        }
      }
    }
    if (verifyPhone){
      // send SMS code 
      const { smsVerify, unverified, authorized} = req.session

      let service
      if (requiredEnvs){
        const client = twilio(accountSid, authToken)
        service = await client.verify.v2.services.create({
          friendlyName: 'My Verify Service',
        });
        await client.verify.v2.services(service.sid).verifications.create({
          to: isLocal ? process.env.SMS_TEST_PHONE : phone,
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
      const newSession = { ...req.session }
      newSession.smsVerify = {otp:{ serviceSid: service.sid }}

      return {
        session: newSession,
        location: '/verify/phone'
      }
    }
  } else if (authorized) {
    phone = authorized.phone
    email = authorized.email
    phoneVerified = authorized.verified?.phone
    emailVerified = authorized.verified?.email
    return {
      json:{
        verifyPhone:phone && !phoneVerified, 
        verifyEmail:email && !emailVerified
      }
    }
  }
}

async function sendLink({ verifyToken, email, redirectAfterAuth = '/', newRegistration = false }){
  const isLocal = process.env.ARC_ENV === 'testing'
  const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
  const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'

  await db.set({ table: 'session', key: verifyToken, verifyToken, email, redirectAfterAuth, newRegistration })

  if (isLocal) {
    console.log('Verify Email Link: ', `${domain}/verify/email?token=${encodeURIComponent(verifyToken)}`)
  }

  if (requiredEnvs) {
    let toEmail = email
    if (isLocal) toEmail = process.env.TRANSACTION_SEND_EMAIL; 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: toEmail,
      from: `${process.env.TRANSACTION_SEND_EMAIL}`,
      subject: 'Enhance Authentication Example Login',
      text: `Here is your link to login to the Enhance authentication example app ${domain}/verify/email?token=${encodeURIComponent(verifyToken)}`
      //html: '<strong>This is HTML</strong>',
    }
    try {
      await sgMail.send(msg)
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log('TRANSACTION_SEND_EMAIL and SENDGRID_API_KEY needed to send')
  }
}
