import db from '@begin/data'

export async function handler (event) {
  const payload = JSON.parse(event?.Records?.[0]?.Sns?.Message)
  const { sessionToken, verifyToken, email, redirectAfterAuth='/', newRegistration=false } = payload
  await db.set({ table: 'session', key: sessionToken, sessionToken, verifyToken, email, redirectAfterAuth, newRegistration })
  await db.set({ table: 'session', key: verifyToken, sessionToken })

  console.log('Login Link: ', `http://localhost:3333/auth/verify?token=${encodeURIComponent(verifyToken)}`)
  return
}
