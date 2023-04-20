import enhanceResponse from './enhance-response.mjs'

export default function auth(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  if (!session?.account) {

    return response.setLocation('/login').send()//TODO: remove
  }
  else {
    response.addData({ authorized: session.account })
  }
}
