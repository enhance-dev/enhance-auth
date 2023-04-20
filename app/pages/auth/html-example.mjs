/**
  * @type {import('@enhance/types').EnhanceApiFn}
  */
export default function({html,state}) {
  const user = state?.store?.account
  return html`<p> Hello ${ user?.name }</p>`
}