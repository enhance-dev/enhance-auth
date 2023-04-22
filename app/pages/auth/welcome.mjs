/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function({ html, state }) {
  const account = state?.store?.authorized
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <p>Welcome New Account ${account?.firstname} you are Logged In.</p>
</enhance-page-container>
`}
