export default function UsernameButton({ html, state }) {
  const { attrs } = state
  const { href } = attrs

  return html`
    <style>
      :host {
        display: block;
        --button-background: seagreen;
        --button-hover-background: mediumseagreen;
      }
    </style>
    <enhance-link-button href="${href}">
      <slot></slot>
    </enhance-link-button>
  `
}
