export async function get(req){
  const session = req.session
  const authorized = session?.authorized ? session?.authorized : false
  return {json: {authorized}}
}
