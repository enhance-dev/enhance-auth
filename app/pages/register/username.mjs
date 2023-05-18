export default function register({ html, state }) {
  const { problems, register } = state.store

  return html`
<form-container>
  <main>

      <h1 class="mb1 font-semibold text2">Register a new account</h1>
      <enhance-form action="/register/username" method="post">
        <div class='grid gap0'>
          <div class="${problems?.form ? 'block' : 'hidden'}">
            <p>Found some problems!</p>
            <ul>${problems?.form}</ul>
          </div>
          <enhance-text-input
            label="Display name"
            id="displayName"
            name="displayName"
            type="text"
            maxlength=30
            required
            errors="${problems?.displayName?.errors}"
            value="${register?.displayName || ''}"
          ></enhance-text-input>
          <enhance-text-input
            label="Username"
            id="username"
            name="username"
            type="text"
            pattern="^[a-zA-Z0-9_\-]*$"
            maxlength=30
            required
            errors="${problems?.username?.errors}"
            value="${register?.username || ''}"
            description='Numbers, letters, and underscores'
          ></enhance-text-input>
          <enhance-text-input
            label="Password"
            id="password"
            name="password"
            type="password"
            minlength="8"
            required
            errors="${problems?.password?.errors}"
            description='At least 8 characters'
          ></enhance-text-input>
          <enhance-text-input
            label="Confirm password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minlength=8
            required
            errors="${problems?.confirmPassword?.errors}"
          ></enhance-text-input>
          <enhance-text-input
            label="Email"
            id="email"
            name="email"
            type="email"
            errors="${problems?.email?.errors}"
            value="${register?.email || ''}"
          ></enhance-text-input>
          <enhance-text-input
            label="Phone number"
            id="phone"
            name="phone"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            errors="${problems?.phone?.errors}"
            value="${register?.phone || ''}"
            description='Format: 123-456-7890'
          ></enhance-text-input>
          <enhance-submit-button>
            <span slot="label">Register</span>
          </enhance-submit-button>
        </div>
      </enhance-form>
  </main>
</form-container>
`}
