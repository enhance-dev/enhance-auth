export default function login({ html, state }) {
  const { githubOauthHref = '' } = state.store
  const problems = state.store.problems || {}
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Login page</h1>
    <div class="${problems.form ? 'block' : 'hidden'}">
      <p>Found some problems!</p>
      <ul>${problems.form}</ul>
    </div>
    <enhance-form action="/login" method="post">
      <enhance-text-input label="Display Name" id="displayName" name="displayName" type="text" error="${problems?.displayName?.errors}" ></enhance-text-input>
      <enhance-text-input label="Password" id="password" name="password" type="password" error="${problems?.password?.errors}"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Login</span></enhance-submit-button>
    </enhance-form>
  </main>
</enhance-page-container>
` }
