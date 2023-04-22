export default function({ html, state }) {
  const { authorized } = state.store
  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <h1>HOME</h1>
  ${authorized ? `<p>Logged in as ${authorized.firstname} ${authorized.lastname}</p>` : `<p>Not Logged In</p>`}
  <p>Details:</p>
  <p>${JSON.stringify(authorized)}</p>
</enhance-page-container>

`
}

