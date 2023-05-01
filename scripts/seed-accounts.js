const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts',
    key: 'u1',
    displayName: 'jane',
    /*password is 'a'*/
    password: '$2a$10$bkNIj7oU2Ol75a0dmpSMweu9UrwT/OPhS7wxTDhaHMnsPlMp7eDw.',
    email: 'admin@example.com',
    verified: { email: true, phone: true },
    phone: '123-123-1234',
    scopes: ['admin', 'member'],
    authConfig: { mfa: { enabled: false, type: 'sms' }, loginAllowed:['password','email-link','sms-code'] },
    provider: { github: { login: 'janedoe' }, google: { email: 'admin@example.com' } },
  })
  await db.set({
    table: 'accounts',
    key: 'u2',
    displayName: 'jsmith',
    /*password is 'secret'*/
    password: '$2a$10$fVqCPIoGWaxEZ.tX73tICOenx9Zh9qvDgrq/mNgbZuxxemFaNTi/G',
    email: 'member@example.com',
    verified: { email: true, phone: true },
    phone: '123-555-1234',
    scopes: ['member'],
    authConfig: { mfa: { enabled: true, type: 'sms' }, loginAllowed:['password'] },
    provider: { github: { login: 'johnsmith' }, google: { email: 'member@example.com' } },
  })

}
main()
