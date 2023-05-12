// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html({ html, state }) {
  const { store } = state
  const account = store.account || {}
  const problems = store.problems || {}

  return html`
<enhance-page-container>
  <nav-menu></nav-menu>
  <enhance-form action="/accounts/${account.key}" method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
    <enhance-form
  action="/accounts"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="Edit Account">
  <enhance-text-input label="Display Name" type="text" id="displayName" name="displayName" value="${account?.displayName}" errors="${problems?.displayName?.errors}"></enhance-text-input>
  <enhance-text-input label="User Name" type="text" id="username" name="username" value="${account?.username}" errors="${problems?.username?.errors || ''}"></enhance-text-input>
  <label>Update Password<input type=checkbox name=updatePassword ${account?.updatePassword ? 'checked' : '' }/></label>
  <enhance-text-input label="Password" type="text" id="password" name="password" errors="${problems?.password?.errors || ''}"></enhance-text-input>
  <enhance-text-input label="Confirm Password" type="text" id="confirmPassword" name="confirmPassword" errors="${problems?.confirmPassword?.errors || ''}"></enhance-text-input>
  <enhance-text-input label="Email" type="email" id="email" name="email" value="${account?.email}" errors="${problems?.email?.errors || ''}"></enhance-text-input>
  <label>Email Verified<input type=checkbox name="verified.email" ${account?.verified?.email ? ' checked ' : ''}/></label>
  <enhance-text-input label="Phone" type="phone" id="phone" name="phone" required value="${account?.phone || ''}" errors="${problems?.phone?.errors || ''}"></enhance-text-input>
  <label>Phone Verified<input type=checkbox name="verified.phone" ${account?.verified?.phone ? ' checked ' : ''}/></label>
  <enhance-fieldset legend="Scopes">
  <label>Scopes
  <select name="scopes[]" >
    <option value="" ></option>
    <option value="member" ${account?.scopes?.[0]==='member' ? 'selected' : '' } >Member</option>
    <option value="admin"  ${account?.scopes?.[0]==='admin' ? 'selected' : '' } >Admin</option>
   </select>
  <select name="scopes[]" >
    <option value="" ></option>
    <option value="member"  ${account?.scopes?.[1]==='member' ? 'selected' : '' } >Member</option>
    <option value="admin"  ${account?.scopes?.[1]==='admin' ? 'selected' : '' } >Admin</option>
   </select>
  </label>
  </enhance-fieldset>
  <enhance-text-input label="Github Login" type=text id="provider.github.login" name="provider.github.login" value="${account?.provider?.github?.login || ''}" errors="${problems?.provider?.github?.login?.errors || ''}"></enhance-text-input>

  <enhance-fieldset legend="login types">
  <label>Username/Password Login Allowed<input type=checkbox name="authConfig.loginWith.username" ${account?.authConfig?.loginWith?.username ? ' checked ' : ''}/></label>
  <label>Github Login Allowed<input type=checkbox name="authConfig.loginWith.github" ${account?.authConfig?.loginWith?.github ? ' checked ' : ''}/></label>
  <label>Magic Link Login Allowed<input type=checkbox name="authConfig.loginWith.email" ${account?.authConfig?.loginWith?.email ? ' checked ' : ''}/></label>
  <label>SMS code Login Allowed<input type=checkbox name="authConfig.loginWith.phone" ${account?.authConfig?.loginWith?.phone ? ' checked ' : ''}/></label>
</enhance-fieldset>
  <enhance-submit-button><span slot=label>Submit</span></enhance-submit-button>
</enhance-form>
</enhance-page-container>`
}
