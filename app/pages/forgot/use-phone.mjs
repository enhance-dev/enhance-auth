
export default function login({ html, state }) {
  const { smsCodeReset } = state.store
  const problems = state.store.problems || {}
  return html`
    <enhance-page-container>
      <nav-menu></nav-menu>
      <main>
        <h1 class="mb1 font-semibold text3">Reset Password</h1>
        <div class="${problems.form ? 'block' : 'hidden'}">
          <p>Found some problems!</p>
          <ul>${problems.form}</ul>
        </div>
          ${!smsCodeReset==='request-phone' ? `
          <enhance-form action="/forgot/use-phone" method="post">
            <enhance-text-input label="Phone Number" id="phone" name="phone" type="phone" errors="${problems?.phone?.errors || ''}" value="${reset?.phone || ''}"></enhance-text-input>
            <enhance-submit-button style="float: right"><span slot="label">Login</span></enhance-submit-button>
          </enhance-form>
          ` : ''}
          ${smsCodeReset==='enter-code' ? `
          <enhance-form action="/forgot/use-phone" method="post">
            <enhance-text-input label="One Time Code" id="smsCode" name="smsCode" type="password"></enhance-text-input>
            <enhance-submit-button style="float: right"><span slot="label">Check One Time Code</span></enhance-submit-button>
          </enhance-form>
          <enhance-form action="/forgot/use-phone?retry" method="post">
            <enhance-submit-button style="float: right"><span slot="label">Send a new code</span></enhance-submit-button>
          </enhance-form>
          ` : ''}
          ${smsCodeReset==='reset' ? `
          <p>Enter a new password</p>
          <enhance-form action="/forgot/use-phone" method="post">
          <enhance-text-input label="New Password" id="password" name="password" type="password" minlength=8 errors="${problems?.password?.errors || ''}" ></enhance-text-input>
          <enhance-text-input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" minlength=8 errors="${problems?.confirmPassword?.errors || ''}" ></enhance-text-input>
          <enhance-submit-button style="float: right"><span slot="label">Reset Password</span></enhance-submit-button>
          </enhance-form>
          ` : ''}
      </main>
    </enhance-page-container>
    ` }
