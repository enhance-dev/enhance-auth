export default function Chiclet({ state, html }) {
  const { attrs } = state
  const { href } = attrs
  return html`
    <style>
      :host div {
        color: var(--light);
      }
    </style>
    <a href="${href}">
      <div class="whitespace-no-wrap pb-1 pt-1 pl0 pr0 font-medium text0 cursor-pointer radius0">
        <slot name="label"></slot>
      </div>
    </a>
  `
}
