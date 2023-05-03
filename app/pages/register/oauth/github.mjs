export default function register({ html, state }) {
  const { problems, register, oauth } = state.store

  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text2">Register a new Account</h1>
    <enhance-form action="/register" method="post">
      <div class="${problems?.form ? 'block' : 'hidden'}">
        <p>Found some problems!</p>
        <ul>${problems?.form}</ul>
      </div>
        ${oauth ? `
      <p>For account recovery please add a phone number or email address</p>
      ` : `
      <enhance-text-input label="Display Name" id="displayName" name="displayName"  type="text" pattern="^[a-zA-Z0-9_\-]*$" maxlength=30 required  errors="${problems?.displayName?.errors}" value="${register?.displayName || ''}"></enhance-text-input>
      <small>Numbers, Letters, and _'s</small>
      <enhance-text-input label="Password" id="password" name="password"  type="password" minlength=8 required errors="${problems?.password?.errors}" ></enhance-text-input>
      <small>Minimum length 8 characters</small>
      <enhance-text-input label="Confirm Password" id="confirmPassword" name="confirmPassword"  type="password" minlength=8 required  errors="${problems?.confirmPassword?.errors}" ></enhance-text-input>
     `}
      <enhance-text-input label="Email" id="email" name="email"  type="email" errors="${problems?.email?.errors}" value="${register?.email || ''}"></enhance-text-input>
      <enhance-text-input label="Phone Number" id="phone" name="phone"  type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  errors="${problems?.phone?.errors}" value="${register?.phone || ''}"></enhance-text-input>
      <small>Format: 123-456-7890</small>
      <enhance-submit-button style="float: right"><span slot="label">Register</span></enhance-submit-button>
    </enhance-form>
  </main>
</enhance-page-container>
`}
