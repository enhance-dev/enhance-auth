export default function PageContainer({ html }) {
  return html`
    <style>
      :host {
        display: block;
        max-width: 80ch;
        margin-inline: auto;
        padding-inline: var(--space-0);
      }
    </style>
    <slot></slot>
  `
}
