export default function register({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<focus-nav href="/" class="block p0"></focus-nav>
<form-container>
  <main>
    <form-container>
      <h1 class="mb1 font-semibold text2">Register a New Account</h1>

      <div class="grid gap-2">
        <button-github href="${githubOauthHref}">
          Continue with GitHub
        </button-github>
        <button-username href="/register/username">
          Continue with Username and Password
        </button-username>
      </div>
    </form-container>
  </main>
</form-container>
`}
