
export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const login = state.store.login || {}
  return html`
  <page-container>
    <main>
      <form-container>
        <enhance-fieldset legend="Log in">
          <div class="${problems.form ? 'block' : 'hidden'}">
            <p>Found some problems!</p>
            <ul>${problems.form}</ul>
          </div>
          <enhance-form action="/login/magic-link" method="post">
            <enhance-text-input label="Email" id="email" name="email" type="email" errors="${problems?.email?.errors || ''}" value="${login?.email || ''}"></enhance-text-input>
            <div class="text-end">
              <enhance-submit-button><span slot="label">Send magic link</span></enhance-submit-button>
            </div>
          </enhance-form>
        </enhance-fieldset>
      </form-container>
    </main>
  </page-container>
  ` }
