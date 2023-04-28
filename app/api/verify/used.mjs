export async function get(req) {
  const authorized = req.session.authorized
  return { json: { authorized } }
}
