export default function({ html, state }) {
  const {authorized,unverified,} = state.store
  let emailIsVerified,phoneIsVerified, hasPhone, hasEmail
  
  if(authorized) {
    hasEmail = authorized.email 
    hasPhone = authorized.phone 
    phoneIsVerified = authorized.phone && authorized.verified?.phone
    emailIsVerified = authorized.email && authorized.verified?.email
  }else if (unverified){
    hasEmail = unverified.email 
    hasPhone = unverified.phone 
    phoneIsVerified = unverified.phone && unverified.verified?.phone
    emailIsVerified = unverified.email && unverified.verified?.email
  }

  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <p>Welcome ${authorized?.displayName || unverified?.displayName} you are logged in.</p>
  ${!(phoneIsVerified || emailIsVerified) ? `<p>You need to verify your account with either your phone number or email</p>` : ''}
  ${ hasEmail  && !emailIsVerified ? `<enhance-link href='/verify/email'>Verify Email</enhance-link>` :''}
  ${ hasPhone && !phoneIsVerified ? `<enhance-link href='/verify/sms'>Verify Phone</enhance-link>` :''}
  ${ !hasPhone && !hasEmail ? `Add an email or phone to your account` :''}
</enhance-page-container>
`}
