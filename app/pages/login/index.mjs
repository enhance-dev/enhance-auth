export default function login({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text2">Log In</h1>

    <div class="grid gap-2">
      <button-github href="${githubOauthHref}">
        Log In with GitHub
      </button-github>
      <button-magic-link href="/login/magic-link">
        Email Magic Link
      </button-magic-link>
      <button-magic-code href="/login/magic-sms">
        Text Magic Code
      </button-magic-code>
      <button-username href="/login/username">
        Username & Password
      </button-username>

      <enhance-link href="/forgot">Forgot Password?</enhance-link>
    </div>

  </main>
</page-container>
` }
