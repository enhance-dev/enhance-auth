const isLocal = process.env.ARC_ENV === 'testing'
const useMock = !process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET
const domain = isLocal ? process.env.DOMAIN_NAME || 'http://localhost:3333' : process.env.DOMAIN_NAME
let urls
if (isLocal && useMock) {
  urls = {
    authorizeUrl: `${domain}/_mock-oauth/login`,
    redirectUrl: `${domain}/login/oauth/github`,
  }
} else {
  urls = {
    authorizeUrl: process.env.OAUTH_AUTHORIZE_URL,
    redirectUrl: `${domain}/login/oauth/github`,
  }
}
export default function loginHref({ redirectAfterAuth = '/', newRegistration = '' }) {

  let oauthState = { redirectAfterAuth }
  if (newRegistration) oauthState = { redirectAfterAuth, newRegistration };


  const redirectUrlPart = urls.redirectUrl
    ? `&redirect_uri=${encodeURIComponent(urls.redirectUrl)}`
    : ''
  return `${urls.authorizeUrl}?client_id=${process.env.OAUTH_CLIENT_ID
  }${redirectUrlPart}${redirectAfterAuth
    ? `&state=${encodeURIComponent(
      JSON.stringify(oauthState)
    )}`
    : ''
  }`
}
