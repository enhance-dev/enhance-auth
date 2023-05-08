export default function login({ html, state }) {
  const problems = state.store.problems || {}
  const forgot = state.store.forgot || {}
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Reset Password</h1>
    <div class="${problems.form ? 'block' : 'hidden'}">
      <p>Found some problems!</p>
      <ul>${problems.form}</ul>
    </div>
    <enhance-form action="/forgot/use-email" method="post">
      <p>Enter your email address or phone number and we'll send you a link or a code to reset your password.</p>
      <enhance-text-input label="Email" id="email" name="email" type="email" error="${problems?.email?.errors}" value="${forgot?.email || ''}"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Request Reset</span></enhance-submit-button>
    </enhance-form>
    <enhance-form action="/forgot/use-phone" method="post">
      <enhance-text-input label="Phone Number" id="phone" name="phone" type="phone" errors="${problems?.phone?.errors || ''}" value="${forgot?.phone || ''}"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Request Reset</span></enhance-submit-button>
    </enhance-form>
  </main>
</enhance-page-container>
` }
