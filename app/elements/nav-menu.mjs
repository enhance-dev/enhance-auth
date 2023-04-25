export default function NavMenu({ state, html }) {
  return html`
<nav class="flex flex-row justify-between items-center">
  <ul class="m1 list-none flex flex-row items-center">
    <li class="ml-1 mr-1"><enhance-link href='/'><strong>example.com</strong></enhance-link></li>
  </ul>
  <ul class="m1 list-none flex flex-row items-center">
    <li class="ml-1 mr-1"><enhance-link href="/accounts">Accounts</enhance-link></li>
    <li class="ml-1 mr-1"><enhance-link href="/register">Register</enhance-link></li>
    <li class="ml-1 mr-1"><enhance-link href="/login">Login</enhance-link></li>
    <form action=/logout method=post>
      <li class="ml-1 mr-1"><enhance-submit-button><span slot=label>Logout<span></enhance-submit-button></li>
    </form>
  </ul>
</nav>
`
}
