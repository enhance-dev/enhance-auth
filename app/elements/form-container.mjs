export default function FormContainer({ html }) {
  return html`
    <style>
      :host {
        display: block;
        max-width: 40ch;
        margin-inline: auto;
      }
    </style>
    <slot></slot>
  `
}
