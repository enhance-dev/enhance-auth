export async function get(req) {
  const session = req.session
  const oauth = session?.oauth

  if (session.problems) {
    let { problems, register, ...newSession } = session
    return {
      session: newSession,
      json: { problems, register, oauth: !!oauth}
    }
  }
  
  return {
    json: { oauth: !!oauth},
  }
}
