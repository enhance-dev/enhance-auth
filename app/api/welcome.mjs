
/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function get(req){
  const session = req.session
  const { authorized, unverified, ...newSession } = session

  if (authorized || unverified){
    return {
      json: { authorized, unverified  }
    }
  }

  return {
    location: '/login'
  }
}
