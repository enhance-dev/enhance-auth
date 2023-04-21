export default function({ html, state }) {
  // const { authorized } = state.store
  return html`
<nav-menu></nav-menu>
<h1>HOME</h1>
<p>${JSON.stringify(state.store?.authorized)}</p>

`
}

