export default function NavMenu({ state, html }) {
  const { authorized = {} } = state.store
  const permissions = authorized.scopes
  return html`
<nav class="flex flex-row justify-content-between align-items-center">
  <ul class="m1 list-none flex flex-row align-items-center">
    <li class="mi-1"><enhance-link href='/'><strong>example.com</strong></enhance-link></li>
  </ul>
  <ul class="m1 list-none flex flex-row align-items-center">
    ${permissions?.includes('admin') ? `
    <li class="mi-1"><enhance-link href="/accounts">Accounts</enhance-link></li>
    ` : '' }
    ${!permissions ? `
    <li class="mi-1"><enhance-link href="/register">Register</enhance-link></li>
    <li class="mi-1"><enhance-link href="/login">Login</enhance-link></li>
    ` : '' }
    ${permissions ? `
    <form action=/logout method=post>
      <li class="mi-1"><enhance-submit-button><span slot=label>Logout<span></enhance-submit-button></li>
    </form>
    ` : '' }
  </ul>
</nav>
`
}
