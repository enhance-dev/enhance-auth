import enhanceResponse from './enhance-response.mjs'
export default function send(req){
  const response = enhanceResponse(req)
  return response.send()
}
