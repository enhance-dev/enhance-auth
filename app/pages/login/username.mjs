export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const login = state.store.login || {}
  return html`
<focus-nav class="block p0" href="/login"></focus-nav>
<page-container>
  <main>
    <form-container>
      <h1 class="mb1 font-semibold text2">
        Log In
      </h1>
      <div class="${problems.form ? 'block' : 'hidden'}">
        <p>Found some problems!</p>
        <ul>${problems.form}</ul>
      </div>

        <enhance-form
          action="/login/username"
          method="post"
          class="
           border1
           border-solid
           radius0
          "
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
              <enhance-submit-button><span slot="label">Log In</span></enhance-submit-button>
              <enhance-link
                class="whitespace-no-wrap"
                href="/forgot"
              >
                Forgot Password?
              </enhance-link>
            </div>
          </div>
        </enhance-form>
    </form-container>
  </main>
</page-container>
` }
