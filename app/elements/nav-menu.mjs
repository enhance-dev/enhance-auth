export default function NavMenu({ state, html }) {
  const { authorized = {} } = state.store
  const loggedIn = authorized.scopes
  const loggedOut = !loggedIn
  const admin = authorized?.scopes?.includes('admin')
  const logoutLinks = loggedIn
    ? `<form action=/logout method=post>
        <enhance-submit-button>
          <span slot="label">Logout</span>
        </enhance-submit-button>
      </form>`
    : ''
  const adminLink =  admin
    ? `<enhance-link href="/accounts">Accounts</enhance-link>`
    : ''
  const loginLinks = loggedOut
    ? `<div
         class="
           flex
           align-items-center
           justify-content-between
         "
       >
         <enhance-link
           class="
             mi-1
             whitespace-no-wrap
           "
           href="/login"
         >
           Log in
         </enhance-link>
         <enhance-link-button href="/register">
           Get started
         </enhance-link-button>
       </div>
      `
    : ''
  return html`
    <nav
      class="
       flex
       flex-row
       justify-content-between
       align-items-center
      "
    >
      <enhance-link class="font-bold" href='/'>enhanceauth.com</enhance-link>
      ${adminLink}
      ${loginLinks}
      ${logoutLinks}
    </nav>
`
}
