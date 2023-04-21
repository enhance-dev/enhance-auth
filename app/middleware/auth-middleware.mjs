import enhanceResponse from './enhance-response.mjs'

export function authRedirect(redirect) {
  return function(req) {
    const response = enhanceResponse(req)
    const session = response.getSession()
    if (!session?.account) {

      response.addSession(redirect)
      return response.setLocation('/login').send()//TODO: remove
    }
    else {
      response.addData({ authorized: session.account })
    }
  }
}

export function accountInfo(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  response.addData({ authorized: session?.account ? session?.account : false })
}

export function auth(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  if (!session?.account) {

    return response.setLocation('/login').send()//TODO: remove
  }
  else {
    response.addData({ authorized: session.account })
  }
}

export function checkRole(role) {
  return function(req) {

    const response = enhanceResponse(req)
    const session = response.getSession()
    const userRoles = session?.account?.roles
    if (!role || !userRoles?.includes(role)) {
      return response.setLocation('/').send() // TODO: Send not authorized message or redirect somewhere else
    }
  }
}


