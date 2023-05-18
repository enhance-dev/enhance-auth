export default function Html({ html }) {
  const isLocal = process.env.ARC_ENV === 'testing'
  const resetMessage = isLocal
    ? 'Check your local dev server’s terminal for a link to reset your password.'
    : 'Check your email or phone for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.'

  return html`
    <page-container>
      <nav-menu></nav-menu>
      <h1 class="mb1 font-semibold text2">Forgot password</h1>
      <p>${resetMessage}</p>
    </page-container>
  `
}
