import crypto from 'crypto'
import db from '@begin/data'
import sgMail from '@sendgrid/mail'

export default async function sendLink({ email, subject='', text, html, linkPath, redirectAfterAuth = '/', newRegistration = false }){
  const isLocal = process.env.ARC_ENV === 'testing'
  const requiredEnvs = process.env.TRANSACTION_SEND_EMAIL && process.env.SENDGRID_API_KEY
  const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'
  const verifyToken = crypto.randomBytes(32).toString('base64')
  const link = `${domain}${linkPath}?token=${encodeURIComponent(verifyToken)}`

  await db.set({ table: 'session', key: verifyToken, verifyToken, 
    email, redirectAfterAuth, newRegistration, linkUsed:false})


  // Local Development Testing Setup
  if (isLocal) {
    console.log(`${subject}: ${link}`)
  }

  if (requiredEnvs) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    let toEmail = email
    if(isLocal) toEmail = process.env.TRANSACTION_SEND_EMAIL;
    const msg = {
      to: toEmail,
      from: `${process.env.TRANSACTION_SEND_EMAIL}`,
      subject,
    }

    if (text) {
      msg.text = text(link)
    } else if (html) {
      msg.html = html(link)
    } else {
      msg.text = `${subject}: ${link}`
    } 

    try {
      await sgMail.send(msg)
    } catch (e) {
      console.error(e)
      console.error(e.response.body.errors)
    }
  } else {
    console.log('TRANSACTION_SEND_EMAIL and SENDGRID_API_KEY needed to send')
  }

  return verifyToken
}
