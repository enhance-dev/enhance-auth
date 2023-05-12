const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts',
    key: 'u1',
    displayName: 'jane',
    username: 'jane',
    /*password is 'a'*/
    password: '$2a$10$bkNIj7oU2Ol75a0dmpSMweu9UrwT/OPhS7wxTDhaHMnsPlMp7eDw.',
    email: 'admin@example.com',
    verified: { email: true, phone: true },
    phone: '123-123-1234',
    scopes: ['admin', 'member'],
    authConfig: { loginAllowed:['username','email-link','sms-code', 'github'] },
    provider: { github: { login: 'janedoe' } },
  })
  await db.set({
    table: 'accounts',
    key: 'u2',
    displayName: 'jsmith',
    username: 'jsmith',
    /*password is 'secret'*/
    password: '$2a$10$fVqCPIoGWaxEZ.tX73tICOenx9Zh9qvDgrq/mNgbZuxxemFaNTi/G',
    email: 'member@example.com',
    verified: { email: true, phone: true },
    phone: '123-555-1234',
    scopes: ['member'],
    authConfig: { loginAllowed:['username','email-link','sms-code', 'github'] },
    provider: { github: { login: 'johnsmith' } },
  })

}
main()
