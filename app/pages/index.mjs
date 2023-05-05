export default function({ html, state }) {
  const { authorized } = state.store
  return html`
<style>
  main { 
    margin: 0 auto;
    max-width: 800px;
  }
</style>
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
  <h1>HOME</h1>
  ${authorized ? `<p>Logged in as ${authorized.displayName}</p>` : `<p>Not Logged In</p>`}
  <p>Details:</p>
  <p>${JSON.stringify(authorized)}</p>
  </main>
</enhance-page-container>

`
}

