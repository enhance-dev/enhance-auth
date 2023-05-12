// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html({ html, state }) {
  const { store } = state
  let accounts = store.accounts || []
  const account = store.account || {}
  const problems = store.problems || {}

  return html`<enhance-page-container>
    <nav-menu></nav-menu>
  <main>
    <h1 class="mb1 font-semibold text3">Accounts page</h1>
    ${accounts.map(item => `<article class="mb2">
<div class="mb0">
  <p class="pb-2"><strong class="capitalize">Display Name: </strong>${item?.displayName || ''}</p>
  <p class="pb-2"><strong class="capitalize">email: </strong>${item?.email || ''}</p>
  <p class="pb-2"><strong class="capitalize">email Verified: </strong>${item?.verified?.email ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">phone: </strong>${item?.phone || ''}</p>
  <p class="pb-2"><strong class="capitalize">phone Verified: </strong>${item?.verified?.phone ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">scopes: </strong>${item?.scopes?.join(', ') || ''}</p>
  <p class="pb-2"><strong class="capitalize">key: </strong>${item?.key || ''}</p>
  <p class="pb-2"><strong class="capitalize">Username Login Allowed: </strong>${item?.authConfig?.loginWith?.username ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">Email Link Login Allowed: </strong>${item?.authConfig?.loginWith?.email ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">Phone Code Login Allowed: </strong>${item?.authConfig?.loginWith?.phone ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">Github Login Allowed: </strong>${item?.authConfig?.loginWith?.github ? 'Yes' : 'No'}</p>
  <p class="pb-2"><strong class="capitalize">Github Oauth: </strong>${item?.provider?.github?.login || ''}</p>
</div>
<p class="mb-1">
  <enhance-link href="/accounts/${item.key}">Edit this account</enhance-link>
</p>
<form action="/accounts/${item.key}/delete" method="POST" class="mb-1">
  <enhance-submit-button><span slot="label">Delete this account</span></enhance-submit-button>
</form>
</article>`).join('\n')}
<details class="mb0" ${Object.keys(problems).length ? 'open' : ''}>
    <summary>New account</summary>
    <enhance-form
  action="/accounts"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="New Account">
  <enhance-text-input label="Display Name" type="text" id="displayName" name="displayName" value="${account?.displayName}" errors="${problems?.displayName?.errors}"></enhance-text-input>
  <enhance-text-input label="User Name" type="text" id="username" name="username" value="${account?.username}" errors="${problems?.username?.errors || ''}"></enhance-text-input>
  <enhance-text-input label="Password" type="password" id="password" name="password" errors="${problems?.password?.errors || ''}"></enhance-text-input>
  <enhance-text-input label="Confirm Password" type="password" id="confirmPassword" name="confirmPassword" errors="${problems?.confirmPassword?.errors || ''}"></enhance-text-input>
  <enhance-text-input label="Email" type="email" id="email" name="email" value="${account?.email}" errors="${problems?.email?.errors || ''}"></enhance-text-input>
  <label>Email Verified<input type=checkbox name="verified.email" ${account?.verified?.email ? ' checked ' : ''}/></label>
  <enhance-text-input label="Phone" type="phone" id="phone" name="phone" value="${account?.phone || ''}" errors="${problems?.phone?.errors || ''}"></enhance-text-input>
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
</details>
</main>
</enhance-page-container>
  `
}
