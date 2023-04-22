export default function login({ html, state }) {
  const { githubOauthHref = '' } = state.store
  const problems = state.store.problems || {}
  return html`<style>
    :host {
        min-width: 20rem;
        max-width: 40rem;
    }
</style>
<enhance-page-container>
  <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Login page</h1>
    <div class="${problems.form ? 'block' : 'hidden'}">
      <p>Found some problems!</p>
      <ul>${problems.form}</ul>
    </div>
    <div class="flex flex-col gap-1 m-auto" >
      <a class="p-2 mb-3 flex-grow w-full font-light text0 radius0 border-solid mb-2 border1" role=button href="${githubOauthHref}">Login with GitHub</a>
    </div>
    <enhance-form action="/login" method="post">
      <p>Login with your Email Only</p>
      <enhance-text-input label="Email" id="email" name="email" type="email"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Login with Email</span></enhance-submit-button>
      <p>Or Login with Username and Password</p>
      <enhance-text-input label="Username" id="username" name="username" type="text"></enhance-text-input>
      <enhance-text-input label="Password" id="password" name="password" type="password"></enhance-text-input>
      <enhance-submit-button style="float: right"><span slot="label">Login with Username/Password</span></enhance-submit-button>
    </enhance-form>
  </main>
</enhance-page-container>
` }
