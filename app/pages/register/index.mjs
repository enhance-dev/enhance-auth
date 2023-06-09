export default function register({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<page-container>
  <nav-menu></nav-menu>
  <form-container>
    <main>
      <h1 class="mb1 font-semibold text2">Register a new account</h1>

      <div class="grid gap-2">
        <button-github href="${githubOauthHref}">
          Continue with GitHub
        </button-github>
        <button-username href="/register/username">
          Continue with username & password
        </button-username>
      </div>
    </main>
  </form-container>
</page-container>
`}
