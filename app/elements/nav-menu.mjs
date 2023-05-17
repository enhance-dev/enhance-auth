export default function NavMenu({ state, html }) {
  const { authorized = {} } = state.store
  const permissions = authorized.scopes
  return html`
<nav class="mb0 flex flex-row justify-content-between align-items-center">
  <ul class="list-none flex flex-row align-items-center">
    <li>
      <enhance-link href='/'><strong>example.com</strong></enhance-link>
    </li>
  </ul>
  <ul class="list-none flex flex-row align-items-center gap-2">
    ${permissions?.includes('admin') ? `
    <li>
      <enhance-link href="/accounts">Accounts</enhance-link>
    </li>
    ` : '' }
    ${!permissions ? `
    <li>
      <enhance-link href="/register">Sign-up</enhance-link>
    </li>
    <li class="mi-1">
      <enhance-link-button href="/login">
        Log In
      </enhance-link-button>
    </li>
    ` : '' }
    ${permissions ? `
    <form action=/logout method=post>
      <li>
        <enhance-submit-button>
          <span slot="label">Logout</span>
        </enhance-submit-button>
      </li>
    </form>
    ` : '' }
  </ul>
</nav>
`
}
