const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts',
    key: 'u1',
    email: 'admin@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    roles: ['admin', 'member'],
    authenticationConfig: { mfa: { type: 'sms', enabled: true, phone: process.env.SMS_SEND_PHONE } },
    provider: { github: { login: 'janedoe' }, google: { email: 'admin@example.com' } },
    username: 'jdoe',/*password is 'a'*/ password: '$2a$10$bkNIj7oU2Ol75a0dmpSMweu9UrwT/OPhS7wxTDhaHMnsPlMp7eDw.'
  })
  await db.set({
    table: 'accounts', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith',
    roles: ['member'],
    authConfig: { mfa: { enabled: true, type: 'sms', phone: process.env.SMS_SEND_PHONE } },
    provider: { github: { login: 'johnsmith' }, google: { email: 'member@example.com' } },
    username: 'jsmith', /*password is 'secret'*/ password: '$2a$10$fVqCPIoGWaxEZ.tX73tICOenx9Zh9qvDgrq/mNgbZuxxemFaNTi/G'
  })

}
main()

