export function checkAuth(req, role) {
  const { session = {} } = req
  const account = session.account
  const accountRoles = Object.values(account?.roles || {})

  if (!account) return false

  if (account && !role) return account

  if (accountRoles?.includes(role)) return true

  return false

}
