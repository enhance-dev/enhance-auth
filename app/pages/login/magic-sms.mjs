
export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const login = state.store.login || {}
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
          <enhance-text-input label="Phone Number" id="phone" name="phone" type="phone" errors="${problems?.phone?.errors}" value="${login?.phone || ''}"></enhance-text-input>
          <enhance-submit-button style="float: right"><span slot="label">Login</span></enhance-submit-button>
      </enhance-form>
      </main>
    </enhance-page-container>
    ` }
