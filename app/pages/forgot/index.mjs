export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const { resetPassword, linkUsed, linkInvalid } = state.store
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Reset Password</h1>
    <div class="${problems.form ? 'block' : 'hidden'}">
      <p>Found some problems!</p>
      <ul>${problems.form}</ul>
    </div>
    <enhance-form action="/forgot" method="post">
      ${linkUsed || linkInvalid ? `<p>The link has expired or is invalid. Request a new link below.</p>` : ''}

      ${resetPassword ? `
      <p>Enter a new password</p>
      <enhance-text-input label="New Password" id="password" name="password" type="password" minlength=8 errors="${problems?.password?.errors || ''}" ></enhance-text-input>
      <enhance-text-input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" minlength=8 errors="${problems?.confirmPassword?.errors || ''}" ></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Reset Password</span></enhance-submit-button>
      ` : `
      <p>Enter your email address or phone number and we'll send you a link or a code to reset your password.</p>
      <enhance-text-input label="Email" id="email" name="email" type="email" error="${problems?.email?.errors}" ></enhance-text-input>
      <enhance-text-input label="Phone Number" id="phone" name="phone" type="phone" errors="${problems?.phone?.errors || ''}" value="${reset?.phone || ''}"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Request Reset</span></enhance-submit-button>
      `}
    </enhance-form>
  </main>
</enhance-page-container>
` }
