export default function NavMenu({ state, html }) {
  return html`
<nav class="flex flex-row justify-between items-center">
  <ul class="m1 list-none flex flex-row items-center">
    <li class="ml-1 mr-1"><enhance-link href='/'><strong>My Website</strong></enhance-link></li>
  </ul>
  <ul class="m1 list-none flex flex-row items-center">
    <li class="ml-1 mr-1"><enhance-link href="/accounts">Accounts</enhance-link></li>
    <li class="ml-1 mr-1"><enhance-link href="/signup">Signup</enhance-link></li>
    <li class="ml-1 mr-1"><enhance-link href="/login">Login</enhance-link></li>
    <li class="ml-1 mr-1"><my-button form=logout><span>Logout<span></my-button></li>
    <form id=logout action=/logout method=post></form>
  </ul>
</nav>
`
}
