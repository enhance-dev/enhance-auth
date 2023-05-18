export default function forgot({ html, state }) {
  const problems = state.store.problems || {}
  const forgot = state.store.forgot || {}
  return html`
<page-container>
  <nav-menu></nav-menu>
  <main>
    <form-container>
      <enhance-fieldset legend="Reset Password">
        <div class="${problems.form ? 'block' : 'hidden'}">
          <p>Found some problems!</p>
          <ul>${problems.form}</ul>
        </div>
        <div class='grid gap0'>
          <enhance-form
            action="/forgot/use-email"
            method="post"
          >
            <div class='grid gap0'>
              <enhance-text-input
                label="Email"
                id="email"
                name="email"
                type="email"
                error="${problems?.email?.errors}"
                value="${forgot?.email || ''}"
              ></enhance-text-input>
              <enhance-submit-button>
                <span slot="label">Request Reset</span>
              </enhance-submit-button>
            </div>
          </enhance-form>
          <enhance-form
            action="/forgot/use-phone"
            method="post"
          >

            <div class='grid gap0'>
              <enhance-text-input
                label="Phone Number"
                id="phone"
                name="phone"
                type="phone"
                errors="${problems?.phone?.errors || ''}"
                value="${forgot?.phone || ''}"
              ></enhance-text-input>
              <enhance-submit-button>
                <span slot="label">Request Reset</span>
              </enhance-submit-button>
            </div>
          </enhance-form>
        </div>
      </enhance-fieldset>
    </form-container>
  </main>
</page-container>
` }
