import db from '@begin/data'

// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
// import { Credentials } from "@aws-sdk/types"

// const credentials = new Credentials({
//   accessKeyId: "ACCESS_KEY_ID",
//   secretAccessKey: "SECRET_ACCESS_KEY",
// });

// const client = new SESClient({
//   region: "REGION", // replace "REGION" with the AWS region where your SES service is located
//   credentials,
// });

// send AWS SES email with link to login 

export async function handler(event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { sessionToken, verifyToken, email, redirectAfterAuth = '/', newRegistration = false } = payload
  await db.set({ table: 'session', key: sessionToken, sessionToken, verifyToken, email, redirectAfterAuth, newRegistration })
  await db.set({ table: 'session', key: verifyToken, sessionToken })

  console.log('Login Link: ', `http://localhost:3333/auth/verify?token=${encodeURIComponent(verifyToken)}`)

  // await sendEmail('recipient@example.com', 'sender@example.com', 'Test Subject', 'This is a test email.')

  return
}





// // Set your API key and server prefix
// const apiKey = 'YOUR_API_KEY';
// const serverPrefix = apiKey.split('-').pop();
// const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/`;

// // Set your verified domain and template ID
// const domain = 'YOUR_VERIFIED_DOMAIN';
// const templateId = 'YOUR_TEMPLATE_ID';

// // Set email parameters
// const to = 'recipient@example.com';
// const fromEmail = `no-reply@${domain}`;
// const subject = 'Your transactional email subject';
// const mergeVars = {
//   FNAME: 'John',
//   LNAME: 'Doe',
// };

// // Prepare the request headers and data
// const headers = {
//   Authorization: `Bearer ${apiKey}`,
//   'Content-Type': 'application/json',
// };

// const data = {
//   template_id: templateId,
//   from_email: fromEmail,
//   subject: subject,
//   to: to,
//   merge_vars: mergeVars,
// };

// // Send the transactional email
// fetch(`${baseUrl}transactional/send`, {
//   method: 'POST',
//   headers: headers,
//   body: JSON.stringify(data),
// })
//   .then((response) => {
//     if (response.ok) {
//       console.log('Email sent successfully!');
//     } else {
//       throw new Error(`Error sending email: ${response.status}`);
//     }
//   })
//   .catch((error) => {
//     console.error(error.message);
//   });
