import oauthUrls from './oauth-urls.mjs'
export default function loginHref({ redirectAfterAuth = '/', newRegistration = '' }) {
  const urls = oauthUrls()

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
