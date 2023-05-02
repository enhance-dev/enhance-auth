export default function ChicletContainer({ html }) {
  return html`
      <style>
        :host section {
          width: 640px;
        }
      </style>
    <section class="m-auto grid gap-1">
        <slot></slot>
    </section>
    `
}
