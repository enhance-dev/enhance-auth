export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const login = state.store.login || {}
  return html`
<style>
h2 {
  display: flex;
  flex-direction: row;
}
h2:before, h2:after{
  content: "";
  flex: 1 1;
  border-bottom: 1px solid;
  margin: auto;
}
h2:before {
  margin-right: 10px
}
h2:after {
  margin-left: 10px
}
</style>
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Login page</h1>
    <enhance-chiclet-container>
      <enhance-chiclet href="/github" style="background-color: var(--secondary-900)">
        <span slot="label">Login with GitHub</span>
      </enhance-chiclet>
      <enhance-chiclet href="/login/magic-email"  style="background-color: var(--success-500)">
        <span slot="label">Email Magic Link</span>
      </enhance-chiclet>
      <enhance-chiclet href="/login/magic-sms"  style="background-color: var(--info-500)">
        <span slot="label">Text Magic Link</span>
      </enhance-chiclet>

    <h2>Have a username and password?</h2>
    <div class="${problems.form ? 'block' : 'hidden'}">
      <p>Found some problems!</p>
      <ul>${problems.form}</ul>
    </div>
    <enhance-form action="/login" method="post">
      <enhance-text-input label="Display Name" id="displayName" name="displayName" type="text" errors="${problems?.displayName?.errors}"  value="${login?.displayName || ''}"></enhance-text-input>
      <enhance-text-input label="Password" id="password" name="password" type="password" errors="${problems?.password?.errors}"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Login</span></enhance-submit-button>
      <enhance-link href="/forgot">Forgot Password?</enhance-link>
    </enhance-form>
    </enhance-chiclet-container>
  </main>
</enhance-page-container>
` }
