import enhanceResponse from './enhance-response.mjs'

export default function checkRole(redirect) {
  return function(req) {
    const response = enhanceResponse(req)
    const session = response.getSession()
    if (!session?.account?.account) {

      response.addSession(redirect)
      return response.setLocation('/login').send()//TODO: remove
    }
    else {
      response.addData({ authorized: session.account.account })
    }
  }
}

