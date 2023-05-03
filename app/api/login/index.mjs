import loginHref from '../../auth-shared/login-href.mjs'

export async function get(req) {
  const { redirectAfterAuth = '/' } = req.session
  const href = loginHref({ redirectAfterAuth })
  return {
    json: { githubOauthHref: href },
  }
}

