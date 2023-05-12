export default function login({ html, state }) {
  const { otpSent } = state.store
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Verify Phone Number</h1>
    <enhance-form action="/verify/phone" method="post">
        ${otpSent ? `
      <p>Enter the one time password sent to your phone</p>
      <enhance-text-input label="One Time Password" id="otpCode" name="otpCode" type="password"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Check One Time Password</span></enhance-submit-button>
        ` : `
      <input name="request" type="hidden" value="request"/>
      <enhance-submit-button style="float: right"><span slot="label">Request One Time Password</span></enhance-submit-button>
        `}
    </enhance-form>
  </main>
</enhance-page-container>
` }
