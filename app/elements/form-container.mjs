export default function FormContainer({ html }) {
  return html`
    <style>
      :host {
        display: block;
        max-width: 40ch;
        margin-inline: auto;
        padding-block-end: var(--space-5);
      }
    </style>
    <slot></slot>
  `
}
