import enhanceResponse from './enhance-response.mjs'
export default function navData(req){
  const response = enhanceResponse(req)
  response.addData({path:req.path})
}
