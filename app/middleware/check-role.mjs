import enhanceResponse from './enhance-response.mjs'

export default function checkRole(role) {
  return function(req) {

    const response = enhanceResponse(req)
    const session = response.getSession()
    const userRoles = session?.account?.account?.roles
    if (!role || !userRoles?.includes(role)) {
      return response.setLocation('/').send() // TODO: Send not authorized message or redirect somewhere else
    }
  }
}
