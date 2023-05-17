export default function FocusNav({ html, state }) {
  const { attrs } = state
  const { href } = attrs
  return html`
    <nav>
      <enhance-link href="${href}">
        ← back
      </enhance-link>
    </nav>
  `
}
