# Enhance Authentication Example
An example of authentication for an Enhance App showing Oauth, Magic Link, and traditional username/password authentication.
This is a work in progress. Please file [issues and bugs](https://github.com/enhance-dev/enhance-auth/issues) on this repo to help improve this resource.

## Getting Started
1. `git clone https://github.com/enhance-dev/enhance-auth`
2. `npm i`
3. `npm start`

## Features
The example currently offers the following features:
- Password/username login
- Email link login (sometimes called "Magic Links")
- Login via SMS code
- New account registration
- Email verification
- Phone number verification
- Forgot password (recovery via SMS or Email)
- OAuth with GitHub

Additional features will be added over time. Planned features include:
- Multifactor authentication (SMS, EMail, and TOTP)
- OAuth with multiple providers
- Scopes for fine grained permissions

## 3rd party services
Enhance and Architect have most of the primitives needed to build a website or app.
For authentication there are several other services needed depending on the required features.
For transactional email and SMS messages a service is required.
If external OAuth login is used a provider account is needed also.

## Local Testing
To simplify local development this example will work without any of the 3rd party providers enabled.
Mock paths are included so that if environment variables for OAuth, Phone, or Email are omitted they will be mocked only for the local development environment.
These bypass code paths do not provide any security and are only active for local testing.

## Seeding accounts for local testing
The `scripts/seed-accounts.js` script is run when the local sandbox is started.
It can be used to seed the database with accounts for testing.
The mock OAuth server in `/auth/_mock/$part.mjs` has fake OAuth accounts.


## Bootstrapping accounts with hard coded Admin
When deploying a new project with no accounts you may need to bootstrap an account to have administrator permissions to edit created accounts.
There are many ways to do this.
For this example there is a hard coded account that becomes active when a temporary password is added with an environment variable.
Set the temporary admin password in HARDCODED_ADMIN_PASSWORD and then login with that password and a display name of "hardcoded".

## Environment Variables

### OAuth Variables
- OAUTH_CLIENT_ID=key
- OAUTH_CLIENT_SECRET=key
- OAUTH_AUTHORIZE_URL=https://github.com/login/oauth/authorize
- OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
- OAUTH_USERINFO_URL=https://api.github.com/user

### SMS Twilio Variables
- TWILIO_API_ACCOUNT_SID=key
- TWILIO_API_TOKEN=key
- SMS_TEST_PHONE=+15555551111

### Transactional Email SendGrid Variables
- SENDGRID_API_KEY=key
- TRANSACTION_SEND_EMAIL=me@example.com

### Miscellaneous Variables
- ARC_APP_SECRET
- DOMAIN_NAME
- HARDCODED_ADMIN_PASSWORD

### Example `.env` for testing
Production and staging environment variables are added using the CLI.
For Begin deployment use the `begin env help` to find more.
For Architect deployment use the `arc env help` to find more.
For local testing you can use a `.env` file similar to the following.

```bash
# Environment Variables used for Authentication
# An app secret is needed to secure sessions
ARC_APP_SECRET=A_REAL_SECRET_FOR_PRODUCTION
HARDCODED_ADMIN_PASSWORD=atemporarypassword
# If OAuth client and secret are empty a mock OAuth is used for testing `/auth/_mock`
OAUTH_CLIENT_ID=key
OAUTH_CLIENT_SECRET=key
OAUTH_AUTHORIZE_URL=https://github.com/login/oauth/authorize
OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
OAUTH_USERINFO_URL=https://api.github.com/user
# If SendGrid and transaction email is empty messages will appear in the console for testing
SENDGRID_API_KEY=key
TRANSACTION_SEND_EMAIL=me@example.com
# If Twilio and SMS sending number is empty SMS messages will appear in the console for testing
TWILIO_API_ACCOUNT_SID=key
TWILIO_API_TOKEN=key
SMS_TEST_PHONE=+15555551111
# Domain will default to http://localhost:3333 for testing locally
DOMAIN_NAME=https://example.com
```

### TODOS
- [ ] Error refresh not working
- [ ] Redirect after login did not work
- [x] Resizing form fields
- [ ] Output username and password to console if no env variables?
- [ ] Required fields in form
- [ ] Single column vs two column forms
- [ ] Composite components for form
- [ ] Guided links from landing page to specific flows
- [x] Update to Enhance styles 5.0
