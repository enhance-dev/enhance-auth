export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const login = state.store.login || {}
  return html`
    <style>
      /* TODO: Expose custom properties for this */
      :host {
        --dark: var(--secondary-300);
      }
    </style>
<focus-nav class="block p0" href="/login"></focus-nav>
<page-container>
  <main>
    <form-container>
      <enhance-fieldset legend="Log in">
        <div class="${problems.form ? 'block' : 'hidden'}">
          <p>Found some problems!</p>
          <ul>${problems.form}</ul>
        </div>
        <enhance-form
          action="/login/username"
          method="post"
        >
          <div class='grid gap-2'>
            <enhance-text-input
              label="Username"
              id="username"
              name="username"
              type="text"
              errors="${problems?.username?.errors}"
              value="${login?.username || ''}"
            ></enhance-text-input>
            <enhance-text-input
              label="Password"
              id="password"
              name="password"
              type="password"
              errors="${problems?.password?.errors}"
            ></enhance-text-input>
            <div
              class="
                flex
                align-items-center
                justify-content-between
              "
            >
              <enhance-submit-button><span slot="label">Log in</span></enhance-submit-button>
              <enhance-link
                class="whitespace-no-wrap"
                href="/forgot"
              >
                Forgot Password?
              </enhance-link>
            </div>
          </div>
        </enhance-form>
      </enhance-fieldset>
    </form-container>
  </main>
</page-container>
` }
