const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'accounts', key: 'u1', email: 'admin@example.com', firstname: 'Jane', lastname: 'Doe',
    roles: ['admin', 'member']
  })
  await db.set({
    table: 'accounts', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith',
    roles: ['member']
  })

  // await db.set({
  //   table: 'roles', key: 'r1', name: 'admin', description: '', rules: {
  //     action_1: 'create', target_1: 'users', owner_1: 'ALL', id_1: '',
  //     action_2: 'read', target_2: 'users', owner_2: 'ALL', id_2: '',
  //     action_3: 'update', target_3: 'users', owner_3: 'ALL', id_3: '',
  //     action_4: 'delete', target_4: 'users', owner_4: 'ALL', id_4: '',
  //   }
  // })
  // await db.set({
  //   table: 'roles', key: 'r2', name: 'member', description: '', rules: {
  //     action_1: 'create', target_1: 'tasks', owner_1: 'SELF', id_1: '',
  //     action_2: 'read', target_2: 'tasks', owner_2: 'SELF', id_2: '',
  //     action_3: 'update', target_3: 'tasks', owner_3: 'SELF', id_3: '',
  //     action_4: 'delete', target_4: 'tasks', owner_4: 'SELF', id_4: '',
  //   }
  // })

  // await db.set({
  //   table: 'accounts', key: 'u2', email: 'member@example.com', firstname: 'John', lastname: 'Smith',
  //   roles: [ 'member' ]
  // })

  // await db.set({
  //   table: 'roles', key: 'r2', name: 'member', description: '', rules: [
  //     { action: 'create', target: 'tasks', owner: 'SELF', id: '' },
  //     { action: 'read', target: 'tasks', owner: 'SELF', id: '' },
  //     { action: 'update', target: 'tasks', owner: 'SELF', id: '' },
  //     { action: 'delete', target: 'tasks', owner: 'SELF', id: '' },
  //     { action: ['delete','read'], target: ['tasks','certification'], owner: 'team2', id: 'cert1' },
  //   ]
  // })


  await db.set({
    table: 'teams', key: 't1', name: 'team1', owner_id: 'u1', description: 'a good team', members: [
      'admin@example.com',
      'member@example.com'
    ]
  })
}
main()

