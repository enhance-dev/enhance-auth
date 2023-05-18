export default function Html({ html }) {
  const isLocal = process.env.ARC_ENV === 'testing'
  const checkEmailMessage = isLocal
    ? `<p>Use the link in your local dev server’s terminal to verify your email.</p>`
    : `<p>Check your email for a link to verify. <enhance-link href='/login'>Log in</enhance-link> if you verified in another tab.</p>`

  return html`
    <page-container>
      <nav-menu></nav-menu>
      <h1 class="mb1 font-semibold text2">Success!</h1>
      <p>Just one more step to go.</p>
      ${checkEmailMessage}
    </page-container>
  `
}
