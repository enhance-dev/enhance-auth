
export async function get(req){
  const query = req.query
  const state = query?.state
  let newRegistration
  try {
    if (state) {
      const parseState = JSON.parse(state)
      newRegistration = parseState?.newRegistration
    }
    // eslint-disable-next-line no-empty
  } catch (e) { }
  if (newRegistration) {
    return {
      location: `/register/oauth/github?${req.rawQueryString}`
    }
  } else {
    return {
      location: `/login/oauth/github?${req.rawQueryString}`
    }

  }

}
