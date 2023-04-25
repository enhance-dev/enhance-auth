const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts',
    key: 'u1',
    displayName: 'jane',
    /*password is 'a'*/
    password: '$2a$10$bkNIj7oU2Ol75a0dmpSMweu9UrwT/OPhS7wxTDhaHMnsPlMp7eDw.',
    email: 'admin@example.com',
    emailVerified: true,
    phone: '123-123-1234',
    firstname: 'Jane',
    lastname: 'Doe',
    roles: ['admin', 'member'],
    provider: { github: { login: 'janedoe' }, google: { email: 'admin@example.com' } },
  })
  await db.set({
    table: 'accounts',
    key: 'u2',
    displayName: 'jsmith',
    /*password is 'secret'*/
    password: '$2a$10$fVqCPIoGWaxEZ.tX73tICOenx9Zh9qvDgrq/mNgbZuxxemFaNTi/G',
    email: 'member@example.com',
    firstname: 'John',
    lastname: 'Smith',
    emailVerified: true,
    phone: '123-555-1234',
    roles: ['member'],
    authConfig: { mfa: { enabled: true, type: 'sms', phone: process.env.SMS_SEND_PHONE } },
    provider: { github: { login: 'johnsmith' }, google: { email: 'member@example.com' } },
  })

}
main()

