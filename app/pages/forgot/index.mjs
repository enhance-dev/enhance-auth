export default function forgot({ html, state }) {
  const problems = state.store.problems || {}
  const forgot = state.store.forgot || {}
  return html`
<page-container>
  <nav-menu></nav-menu>
  <main>
    <form-container>
      <enhance-fieldset legend="Reset password">
        <div class="${problems.form ? 'block' : 'hidden'}">
          <p>Found some problems!</p>
          <ul>${problems.form}</ul>
        </div>
        <div class='grid gap2'>

          <details>
            <summary class="mb0">Reset via email</summary>
            <enhance-form
              action="/forgot/use-email"
              method="post"
            >
              <div class='grid gap-1'>
                <enhance-text-input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  error="${problems?.email?.errors}"
                  value="${forgot?.email || ''}"
                ></enhance-text-input>
                <enhance-submit-button>
                  <span slot="label">Send reset email</span>
                </enhance-submit-button>
              </div>
            </enhance-form>

          </details>

          <details>
            <summary class="mb0">Reset via text</summary>
            <enhance-form
              action="/forgot/use-phone"
              method="post"
            >
              <div class='grid gap-1'>
                <enhance-text-input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="phone"
                  errors="${problems?.phone?.errors || ''}"
                  value="${forgot?.phone || ''}"
                ></enhance-text-input>
                <enhance-submit-button>
                  <span slot="label">Send reset text</span>
                </enhance-submit-button>
              </div>
            </enhance-form>
          </details>
        </div>
      </enhance-fieldset>
    </form-container>
  </main>
</page-container>
` }
