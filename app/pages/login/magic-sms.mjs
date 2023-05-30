
export default function login({ html, state }) {
  const { smsCodeLogin } = state.store
  const problems = state.store.problems || {}
  const login = state.store.login || {}
  return html`
    <style>
      .primary500 {
        color: var(--primary-500);
      }

      .float-left {
        float: left;
      }

      .float-right {
        float: right;
      }
    </style>
    <page-container>
      <main>
        <form-container>
          <enhance-fieldset legend="Log in">
            <div class="${problems.form ? 'block' : 'hidden'}">
              <p>Found some problems!</p>
              <ul>${problems.form}</ul>
            </div>
            ${!smsCodeLogin ? `
            <enhance-form action="/login/magic-sms" method="post">
              <enhance-text-input label="Phone number" id="phone" name="phone" type="phone" description="Format: 123-456-7890" errors="${problems?.phone?.errors || ''}" value="${login?.phone || ''}"></enhance-text-input>
              <div class="text-end">
                <enhance-submit-button><span slot="label">Send magic code</span></enhance-submit-button>
              </div>
            </enhance-form>
            ` : ''}
            ${smsCodeLogin ? `
            <enhance-form action="/login/magic-sms" method="post">
              <enhance-text-input label="Magic code" id="smsCode" name="smsCode" type="password"></enhance-text-input>
              <enhance-submit-button class="float-right"><span slot="label">Log in</span></enhance-submit-button>
            </enhance-form>
            <enhance-form action="/login/magic-sms?retry" method="post" class="float-left">
              <button type="submit" class="pb-3 primary500 underline">Send new code</button>
            </enhance-form>
            ` : ''}
          </enhance-fieldset>
        </form-container>
      </main>
    </page-container>
    ` }
