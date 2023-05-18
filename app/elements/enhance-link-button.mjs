export default function EnhanceLinkButton({ html, state }) {
  const { attrs } = state
  const { href } = attrs
  return html`
  <style>
    :host a {
      color: var(--light);
      background-color: var(--button-background, var(--primary-500))
    }
    :host a:focus, :host a:hover {
      background-color: var(--button-hover-background, var(--primary-400))
    }
  </style>
  <a
    href="${href}"
    class="
      si-100
      inline-block
      whitespace-no-wrap
      pb-3
      pi0
      font-semibold
      cursor-pointer
      radius0
    "
  >
    <slot></slot>
  </a>
`
}
