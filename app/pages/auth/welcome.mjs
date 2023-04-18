/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function ({ html, state }) {
  const account = state?.store?.account?.account
  return html`<p>Welcome New Account ${account?.email} you are Logged In.</p>`
}
