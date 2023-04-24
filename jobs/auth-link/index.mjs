import db from '@begin/data'
import sgMail from '@sendgrid/mail'

export async function handler(event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { sessionToken, verifyToken, email, redirectAfterAuth = '/', newRegistration = false } = payload
  await db.set({ table: 'session', key: sessionToken, sessionToken, verifyToken, email, redirectAfterAuth, newRegistration })
  await db.set({ table: 'session', key: verifyToken, sessionToken })

  let toEmail = email

  // Local Development Testing Setup
  if (process.env.ARC_ENV === 'testing') {
    console.log('Login Link: ', `http://localhost:3333/auth/verify?token=${encodeURIComponent(verifyToken)}`)
    toEmail = process.env.TRANSACTION_EMAIL
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: toEmail,
    from: `${process.env.TRANSACTION_EMAIL}`,
    subject: 'enhance-auth-magic-link',
    text: `http://localhost:3333/auth/verify?token=${encodeURIComponent(verifyToken)}`
    //html: '<strong>This is HTML</strong>',
  }
  try {
    await sgMail.send(msg)
  } catch (e) {
    console.error(e)
  }
}


