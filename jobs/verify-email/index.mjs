import db from '@begin/data'
import sgMail from '@sendgrid/mail'
const isLocal = process.env.ARC_ENV === 'testing'
const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'

export async function handler(event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { verifyToken, email, redirectAfterAuth = '/', newRegistration = false } = payload
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
      subject: 'enhance-auth-magic-link',
      text: `${domain}/verify/email?token=${encodeURIComponent(verifyToken)}`
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
