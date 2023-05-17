export default function({ html, state }) {
  const { authorized } = state.store
  return html`
<page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class='text3 font-semibold text-center mb4'>Enhance Auth Demo</h1>
    ${!authorized ? `<p class='text-center'>Welcome! Please register or log in to get started.</p>` : ''}
    ${authorized ? `<p>Logged in as ${authorized.displayName}</p>` : ''}
    ${authorized ? `<p>${JSON.stringify(authorized)}</p>` : ''}
  </main>
</page-container>
`
}
