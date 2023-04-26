@app
begin-app

@static
prune true

@events
auth-link
  src jobs/auth-link
verify-email
  src jobs/verify-email
reset-password-link
  src jobs/reset-password-link

@plugins
enhance/arc-plugin-enhance
ryanbethel/enhance-styles-cheatsheet
#arc-plugin-oauth


@oauth
use-mock true

mock-list auth/mock-allow.mjs

allow-list auth/allow.mjs
