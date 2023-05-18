export default function login({ html, state }) {
  const { otpSent } = state.store
  const isLocal = process.env.ARC_ENV === 'testing'

  const otpMessage = isLocal
    ? `<p class='mbe0'>Enter the one time password shown in your local dev server’s terminal.</p>`
    : `<p class='mbe0'>Enter the one time password sent to your phone.</p>`
  return html`
<form-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text2">Verify phone number</h1>
    <enhance-form action="/verify/phone" method="post">
        ${otpSent ? `
      ${otpMessage}
      <enhance-text-input label="One time password" id="otpCode" name="otpCode" type="password"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Verify</span></enhance-submit-button>
        ` : `
      <input name="request" type="hidden" value="request"/>
      <enhance-submit-button style="float: right"><span slot="label">Request one time password</span></enhance-submit-button>
        `}
    </enhance-form>
  </main>
</form-container>
` }
