/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function({ html, state }) {
  const account = state?.store?.authorized
  console.log(state)
  return html`<p>Welcome New Account ${account?.firstname} you are Logged In.</p>`
}
