export default function GithubButton({ html, state }) {
  const { attrs } = state
  const { href } = attrs

  return html`
    <style>
      :host {
        display: block;
        --button-background: #222;
        --button-hover-background: #444;
      }
    </style>
    <enhance-link-button href="${href}">
      <slot></slot>
    </enhance-link-button>
  `
}
