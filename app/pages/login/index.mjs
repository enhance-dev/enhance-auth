export default function login({ html, state }) {
  const githubOauthHref = state.store.githubOauthHref || ''
  return html`
<style>
h2 {
  display: flex;
  flex-direction: row;
}
h2:before, h2:after{
  content: "";
  flex: 1 1;
  border-bottom: 1px solid;
  margin: auto;
}
h2:before {
  margin-right: 10px
}
h2:after {
  margin-left: 10px
}
</style>
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Login page</h1>
    <enhance-chiclet-container>
      <enhance-chiclet href="${githubOauthHref}" style="background-color: var(--secondary-900)">
        <span slot="label">Login with GitHub</span>
      </enhance-chiclet>
      <enhance-chiclet href="/login/magic-link"  style="background-color: var(--success-500)">
        <span slot="label">Email Magic Link</span>
      </enhance-chiclet>
      <enhance-chiclet href="/login/magic-sms"  style="background-color: var(--info-500)">
        <span slot="label">Text Magic Code</span>
      </enhance-chiclet>
      <enhance-chiclet href="/login/username"  style="background-color: var(--primary-500)">
        <span slot="label">Username & Password</span>
      </enhance-chiclet>

      <enhance-link href="/forgot">Forgot Password?</enhance-link>
    </enhance-chiclet-container>
  </main>
</enhance-page-container>
` }
