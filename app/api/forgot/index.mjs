export async function get(req) {
  const {problems, forgot, ...newSession}= req.session
  if (problems){
    return{
      session: newSession,
      json: {problems, forgot}
    }
  }
}
