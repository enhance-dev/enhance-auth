/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html({ html, state }) {
  const { store } = state
  const registration = store.registration || {}
  const problems = store.problems || {}
  const { traditional } = store

  return html`<enhance-page-container>
    <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Register New Account</h1>
    <enhance-form
  action="/auth/register/${registration.key}"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="Account">
  ${traditional ? `
    <enhance-text-input label="Username" type="text" id="username" name="username" value="${registration?.username || ''}" errors="${problems?.username?.errors || ''}"></enhance-text-input>
    <enhance-text-input label="Password" type="password" id="password" name="password" value="${registration?.password || ''}" errors="${problems?.password?.errors || ''}"></enhance-text-input>
  ` : ''}
  <enhance-text-input label="Firstname" type="text" id="firstname" name="firstname" value="${registration?.firstname}" errors="${problems?.firstname?.errors}"></enhance-text-input>
  <enhance-text-input label="Lastname" type="text" id="lastname" name="lastname" value="${registration?.lastname}" errors="${problems?.lastname?.errors}"></enhance-text-input>
  <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
  </enhance-fieldset>
</enhance-form>
</main>
</enhance-page-container>
`
}
