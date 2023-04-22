export default function Button({ html, state }) {
  return html`
<style>
  :host button {
    color: var(--light);
    background-color: var(--primary-500)
  }
  :host button:focus, :host button:hover {
    outline: none;
    background-color: var(--primary-400)
  }
</style>
<button class="whitespace-no-wrap pb-3 pt-3 pl0 pr0 font-medium text0 cursor-pointer radius0"><slot></slot></button>
    `
}
