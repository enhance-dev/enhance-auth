export default function NavMenu({ state, html }) {
  return html`
<nav>
  <ul>
    <li><strong>Site</strong></li>
  </ul>
  <ul>
    <li><a href="#">Link</a></li>
    <li><a href="/login">Login</a></li>
    <li><form action=/logout method=post><button>Logout</button></form></li>
  </ul>
</nav>
`
}
