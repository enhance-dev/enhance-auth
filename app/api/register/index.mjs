import loginHref from '../../auth-shared/login-href.mjs'
export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth, newRegistration: true })

  if (req.session.problems) {
    let { problems, register, ...newSession } = req.session
    return {
      session: newSession,
      json: { problems, register }
    }
  }

  return {
    json: { githubOauthHref: href },
  }
}
