export default function UsedLink({html,state}){
  const authorized = state.store.authorized

  return html` 
<enhance-page-container>
<nav-menu></nav-menu>
  <h1 class="mb1 font-semibold text2">Link Used</h1>
  <p>The link expired or has already been used.</p>
  ${authorized ? `
  <p>Request a new link <enhance-link href='/verify/email'>New Link</enhance-link> </p>

  ` : `
  <p>Log in to request a new verification link <enhance-link href='/login'>Log in</enhance-link> </p>

  `}
</enhance-page-container>

  `
}
