export default function signup({ html, state }) {
  const { githubOauthHref } = state.store

  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Signup Page</h1>
    <enhance-form action="/signup" method="post">
      <p>Register with your Email</p>
      <input type=hidden name=registrationType value=magicLink />
      <enhance-text-input label="Email" id="email" name="email"  type="email"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Register with Email</span></enhance-submit-button>
    </enhance-form>
      <div class="flex justify-center m2"> <a href=${githubOauthHref}>Register with GitHub</a></div>
    <enhance-form action="/signup" method="post">
      <input type=hidden name=registrationType value=traditional />
      <enhance-submit-button style="float: right"><span slot="label">Register with Username/Password</span></enhance-submit-button>
    </enhance-form>
  </main>
</enhance-page-container>
`}
