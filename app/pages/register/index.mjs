export default function register({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text2">Register a new Account</h1>
    <enhance-chiclet-container>
      <enhance-chiclet href="${githubOauthHref}" style="background-color: var(--secondary-900)">
        <span slot="label">Continue with GitHub</span>
      </enhance-chiclet>
      <enhance-chiclet href="/register/account"  style="background-color: var(--primary-500)">
        <span slot="label">Continue with Username and Password</span>
      </enhance-chiclet>
    </enhance-chiclet-container>
  </main>
</enhance-page-container>
`}
