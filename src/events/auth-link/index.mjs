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



async function sendEmail(to, from, subject, message) {
  const client = new SESClient({ region: "REGION" }); // replace "REGION" with the AWS region where your SES service is located

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: from,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await client.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return response;
  } catch (err) {
    console.log("Error sending email:", err);
    throw err;
  }
}


