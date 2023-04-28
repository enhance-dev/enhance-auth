import db from '@begin/data'
import sgMail from '@sendgrid/mail'

export async function handler(event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { verifyToken, email, redirectAfterAuth = '/', newRegistration = false } = payload
  await db.set({ table: 'session', key: verifyToken, verifyToken, 
    email, redirectAfterAuth, newRegistration, linkUsed:false})
  console.log('Reset token: ', verifyToken)

  let toEmail = email

  // Local Development Testing Setup
  if (process.env.ARC_ENV === 'testing') {
    console.log('Reset Password: ', `http://localhost:3333/forgot?token=${encodeURIComponent(verifyToken)}`)
    toEmail = process.env.TRANSACTION_SEND_EMAIL
  }

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // const msg = {
  //   to: toEmail,
  //   from: `${process.env.TRANSACTION_SEND_EMAIL}`,
  //   subject: 'enhance-auth-magic-link',
  //   text: `http://localhost:3333/forgot?token=${encodeURIComponent(verifyToken)}`
  //   //html: '<strong>This is HTML</strong>',
  // }
  // try {
  //   await sgMail.send(msg)
  // } catch (e) {
  //   console.error(e)
  // }
}


