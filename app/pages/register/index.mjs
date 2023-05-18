export default function register({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<page-container>
  <nav-menu></nav-menu>
  <form-container>
    <main>
      <form-container>
        <h1 class="mb1 font-semibold text2">Register a new account</h1>

        <div class="grid gap-2">
          <button-github href="${githubOauthHref}">
            Continue with GitHub
          </button-github>
          <button-username href="/register/username">
            Continue with username and password
          </button-username>
        </div>
      </form-container>
    </main>
  </form-container>
</page-container>
`}
