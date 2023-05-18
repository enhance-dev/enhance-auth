export default function({ html, state }) {
  const { authorized } = state.store
  return html`
<style>
  pre {
    background: hsla(0deg 0% 0% / 0.05);
  }
</style>
<page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class='text3 font-semibold text-center mb4'>Enhance Auth Demo</h1>
    ${!authorized ? `<p class='text-center'>Welcome! Please register or log in to get started.</p>` : ''}
    ${authorized ? `<p class='text-center'><strong>Success!</strong> You’re logged in as ${authorized.displayName}.</p>` : ''}
    ${authorized ? `
      <details class='mbs0 text-1'>
        <summary class='cursor-pointer text-center'>User data</summary>
        <pre class='whitespace-pre-wrap p0'>${JSON.stringify(authorized, null, 2)}</pre>
      </details>
    ` : ''}
  </main>
</page-container>
`
}
