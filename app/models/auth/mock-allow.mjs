export default {
  mockProviderAccounts: {
    'Jane Doe': {
      login: 'janedoe',
      name: 'Jane Doe'
    },
    'John Smith': {
      login: 'johnsmith',
      name: 'John Smith'
    },
    // A simulated OAuth user not authorized for the app
    'Not Authorized': {
      login: 'notallowed',
      name: 'Not Allowed'
    }
  },
  appAccounts: {
    janedoe: {
      role: 'member',
      name: 'Jane Doe'
    },
    johnsmith: {
      role: 'member',
      name: 'John Smith'
    }
  }
}
