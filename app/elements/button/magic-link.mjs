export default function MagicLink({ html, state }) {
  const { attrs } = state
  const { href } = attrs

  return html`
    <style>
      :host {
        display: block;
        --button-background: royalblue;
        --button-hover-background: cornflowerblue;
      }
    </style>
    <enhance-link-button class="text-center" href="${href}">
      <slot></slot>
    </enhance-link-button>
  `
}
