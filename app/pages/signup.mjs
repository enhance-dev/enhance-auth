export default function signup({ html, state }) {
  const { githubOauthHref } = state.store

  return html`
<enhance-page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Signup Page</h1>
    <enhance-form action="/signup?magic" method="post">
      <p>Register with your Email</p>
      <enhance-text-input label="Email" id="email" name="email"  type="email"></enhance-text-input>
    </enhance-form>
    <a href=${githubOauthHref}>Register with GitHub</a>
    <a href="/register?traditional">Register with Username and Password</a>
  </main>
</enhance-page-container>
`}
