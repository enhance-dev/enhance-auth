export default function login({ html, state }) {
  const { githubOauthHref = '' } = state.store
  return html`<enhance-page-container>
      <main>
        <h1 class="mb1 font-semibold text3">Login page</h1>
        <a role=button href="${githubOauthHref}">Login with GitHub</a>
        <enhance-form action="/login" method="post">
        <p>Login with your Email Only</p>
        <enhance-text-input label="Email" id="email" name="email" type="email"></enhance-text-input>
    </enhance-form>
    </main>
    </enhance-page-container>
` }
