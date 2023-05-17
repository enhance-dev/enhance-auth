export default function register({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text2">Register a new Account</h1>

    <div class="grid gap-2">
      <button-github href="${githubOauthHref}">
        Continue with GitHub
      </button-github>
      <button-username href="/register/username">
        Continue with Username and Password
      </button-username>
    </div>
  </main>
</page-container>
`}
