const isLocal = process.env.ARC_ENV === 'testing'
const useMock = !process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET
const domain = process.env.DOMAIN_NAME || 'http://localhost:3333'
const urls = {
  authorizeUrl: `${domain}/_mock-oauth/login`,
  codeUrl: `${domain}/_mock-oauth/code`,
  redirectUrl: `${domain}/login/oauth/github`,
  tokenUrl: `${domain}/_mock-oauth/token`,
  userInfoUrl: `${domain}/_mock-oauth/user`,
}

const mockProviderAccounts = [
  {
    login: 'janedoe',
    name: 'Jane Doe'
  },
  {
    login: 'johnsmith',
    name: 'John Smith'
  },
  {
    login: 'newperson',
    name: 'New Person'
  }
]

export const get = [local, mock, getLogin, getCode, getUserInfo]
export const post = [local, mock, postToken]

async function local() {
  if (!isLocal) {
    return {
      status: 404,
      html: 'Not found'
    }
  }
}
async function mock() {
  if (!useMock) {
    return {
      status: 404,
      html: 'Not found'
    }
  }
}

async function getLogin(req) {
  const mockCodes = mockProviderAccounts.map((i) =>
    Buffer.from(i.login).toString('base64')
  )
  if (req.params.part === 'login') {
    const state = req?.query?.state
    return {
      status: 200,
      html: `
<h1 style="font-size:2rem">Mock OAuth Login Page</h1>
    ${mockProviderAccounts
    .map(
      (k, i) =>
        `<a href="${urls.codeUrl +
              '?mock=' +
              mockCodes[i] +
              `${state ? `&state=${encodeURIComponent(state)}` : ''}`
        }">${k.name}</a>`
    )
    .join(' <br/> ')}
    `
    }
  }
}
async function getCode(req) {
  const state = req?.query?.state
  if (req.params.part === 'code') {
    const code = req.query.mock
    const redirect = urls.redirectUrl
    return {
      status: 302,
      location: `${redirect}?code=${code}${state ?
        `&state=${encodeURIComponent(state)}` : ''
      }`
    }
  }
}
async function postToken(req) {
  if (req.params.part === 'token') {
    const access_token = req.body.code
    return {
      status: 200,
      json: { access_token }
    }
  }
}
async function getUserInfo(req) {
  if (req.params.part === 'user') {
    const token = req.headers.authorization.replace('token ', '')
    const userReference = Buffer.from(token, 'base64').toString('ascii')
    const oauthUser = mockProviderAccounts.find(u => userReference === u.login)

    return {
      status: 200,
      json: oauthUser
    }
  }
}
