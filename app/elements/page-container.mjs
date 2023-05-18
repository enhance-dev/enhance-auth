export default function PageContainer({ html }) {
  return html`
    <style>
      :host {
        display: block;
        max-width: 80ch;
        margin-block: var(--space-0);
        margin-inline: auto;
        padding-inline: var(--space-0);
      }
    </style>
    <slot></slot>
  `
}
