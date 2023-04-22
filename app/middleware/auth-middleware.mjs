import enhanceResponse from './enhance-response.mjs'

export function authRedirect(redirect) {
  return function(req) {
    const response = enhanceResponse(req)
    const session = response.getSession()
    if (!session?.authorized) {

      response.addSession(redirect)
      return response.setLocation('/login').send()//TODO: remove
    }
    else {
      response.addData({ authorized: session.authorized })
    }
  }
}

export function accountInfo(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  response.addData({ authorized: session?.authorized ? session?.authorized : false })
}

export function auth(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  if (!session?.authorized) {

    return response.setLocation('/login').send()//TODO: remove
  }
  else {
    response.addData({ authorized: session.authorized })
  }
}

export function checkRole(role) {
  return function(req) {

    const response = enhanceResponse(req)
    const session = response.getSession()
    const userRoles = session?.authorized?.roles
    if (!role || !userRoles?.includes(role)) {
      return response.setLocation('/').send() // TODO: Send not authorized message or redirect somewhere else
    }
  }
}


