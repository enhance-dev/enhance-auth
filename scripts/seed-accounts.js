const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts',
    key: 'u1',
    email: 'admin@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    roles: ['admin', 'member'],
    provider: { github: { login: 'janedoe' }, google: { email: 'admin@example.com' } },
    username: 'janedoe', password: 'hash123'
  })
  await db.set({
    table: 'accounts', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith',
    roles: ['member'],
    provider: { github: { login: 'janedoe' }, google: { email: 'admin@example.com' } },
    username: 'janedoe', password: 'hash123'
  })

  await db.set({
    table: 'teams', key: 't1', name: 'team1', owner_id: 'u1', description: 'a good team', members: [
      'admin@example.com',
      'member@example.com'
    ]
  })
}
main()

