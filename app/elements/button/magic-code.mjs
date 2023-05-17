export default function MagicCode({ html, state }) {
  const { attrs } = state
  const { href } = attrs

  return html`
    <style>
      :host {
        display: block;
        --button-background: darkslateblue;
        --button-hover-background: slateblue;
      }
    </style>
    <enhance-link-button href="${href}">
      <slot></slot>
    </enhance-link-button>
  `
}
