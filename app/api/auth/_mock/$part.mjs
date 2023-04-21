import arc from '@architect/functions'
import oauthUrls from '../../../auth/oauth-urls.mjs'

const providerAccounts = [
  {
    login: 'janedoe',
    name: 'Jane Doe'
  },
  {
    login: 'johnsmith',
    name: 'John Smith'
  },
  {
    login: 'newguy',
    name: 'New Guy'
  }
]

export const get = [getLogin, getCode, /*getToken,*/ getUserInfo]
export const post = [postToken]

async function getLogin(req) {
  const urls = oauthUrls()
  const mockCodes = providerAccounts.map((i) =>
    Buffer.from(i.login).toString('base64')
  )
  if (req.params.part === 'login') {
    const state = req?.query?.state
    return {
      status: 200,
      html: `
    ${providerAccounts
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
    const urls = oauthUrls()
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
    const oauthUser = providerAccounts.find(u => userReference === u.login)

    return {
      status: 200,
      json: oauthUser
    }
  }
}
