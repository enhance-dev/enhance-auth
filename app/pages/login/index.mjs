export default function login({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<page-container>
  <nav-menu></nav-menu>
  <form-container>
    <main>
      <h1 class="mb1 font-semibold text2">Choose log in</h1>

      <div class="grid gap0">
        <button-github href="${githubOauthHref}">
          Log in with GitHub
        </button-github>
        <button-magic-link href="/login/magic-link">
          Email magic link
        </button-magic-link>
        <button-magic-code href="/login/magic-sms">
          Text magic code
        </button-magic-code>
        <button-username href="/login/username">
          Username & password
        </button-username>

        <enhance-link href="/forgot">Forgot password?</enhance-link>
      </div>

    </main>
  </form-container>
</page-container>
` }
