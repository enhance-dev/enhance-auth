import {sendCode} from '../../auth-shared/sms-code-verify.mjs'
import sendLink from '../../auth-shared/send-email-link.mjs'

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
      await sendLink({ email, redirectAfterAuth, subject:'Enhance Auth Verify Email Link', linkPath:'/verify/email' })
      if (!verifyPhone){
        return {
          session: newSession,
          location: '/verify/waiting-email'
        }
      }
    }
    if (verifyPhone){
      // send SMS code 
      const { smsVerify, unverified, authorized} = req.session

      const serviceSid = await sendCode({phone, friendlyName:'Enhance Auth Verify Phone'})

      const newSession = { ...req.session }
      newSession.smsVerify = {otp:{ serviceSid }}

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

