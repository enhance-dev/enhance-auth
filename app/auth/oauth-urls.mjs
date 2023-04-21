export default function() {
  const env = process.env.ARC_ENV
  const domains = {
    testing: `http://localhost:3333`,
    staging: 'https://staging.example.com',
    production: 'https://example.com'
  }
  switch (env) {
    case 'testing':
      return {
        authorizeUrl: `http://localhost:3333/auth/_mock/login`,
        codeUrl: `http://localhost:3333/auth/_mock/code`,
        redirectUrl: `${domains[env]}/auth/oauth`,
        tokenUrl: `http://localhost:3333/auth/_mock/token`,
        userInfoUrl: `http://localhost:3333/auth/_mock/user`,
      }
    case 'production':
      return {
        authorizeUrl: `https://github.com/login/oauth/authorize`,
        redirectUrl: `${domains[env]}/auth/oauth`,
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
      }
    default: // defaults to case 'staging':
      return {
        authorizeUrl: `https://github.com/login/oauth/authorize`,
        redirectUrl: `${domains[env]}/auth/oauth`,
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
      }
  }
}
