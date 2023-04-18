import enhanceResponse from './enhance-response.mjs'
export default function authStatus(req) {
  const response = enhanceResponse(req)
  const session = response.getSession()
  response.addData({ authorized: session?.account?.account ? session?.account?.account : false })
}
