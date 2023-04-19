import db from '@begin/data'

export async function handler(event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { sessionToken, verifyToken, email, redirectAfterAuth = '/', newRegistration = false } = payload
  await db.set({ table: 'session', key: sessionToken, sessionToken, verifyToken, email, redirectAfterAuth, newRegistration })
  await db.set({ table: 'session', key: verifyToken, sessionToken })

  console.log('Login Link: ', `http://localhost:3333/auth/verify?token=${encodeURIComponent(verifyToken)}`)


  return
}


// const twilio = require('twilio');

// // Set your Twilio account credentials
// const accountSid = 'ACCOUNT_SID';
// const authToken = 'AUTH_TOKEN';
// const client = twilio(accountSid, authToken);

// // Set your Twilio phone number
// const twilioPhoneNumber = 'TWILIO_PHONE_NUMBER';

// /**
//  * Send a message using Twilio.
//  *
//  * @param {string} to - Recipient's phone number (e.g., '+1234567890').
//  * @param {string} body - The content of the message.
//  * @returns {Promise} - A promise that resolves when the message is sent.
//  */
// async function sendMessage(to, body) {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: twilioPhoneNumber,
//       to: to,
//     });

//     console.log(`Message sent: ${message.sid}`);
//   } catch (error) {
//     console.error(`Error sending message: ${error.message}`);
//   }
// }

// // Usage example
// const recipientPhoneNumber = '+1234567890'; // Replace with the recipient's phone number
// const messageBody = 'Hello, this is a message sent via Twilio!';

// sendMessage(recipientPhoneNumber, messageBody);

