export default function Chiclet({ state, html }) {
  const { attrs } = state
  const { href } = attrs
  return html`
    <style>
      :host {
        color: var(--light);
      }
    </style>
    <a href="${href}">
      <div class="whitespace-no-wrap pb-1 pi0 font-semibold cursor-pointer radius0">
        <slot name="label"></slot>
      </div>
    </a>
  `
}
