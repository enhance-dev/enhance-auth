// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html({ html, state }) {
  const { store } = state
  const team = store.team || {}
  const problems = store.problems || {}

  return html`

<layout-page>
  <header>
    <h1 >Add Team</h1>
  </header>
  <main>
    <form method="POST" action="/teams/${team.key}">
      <h3>New Team</h3>
      <p>Add Team Details</p>
      <div class="${problems.form ? 'block' : 'hidden'}">
        <p>Found some problems!</p>
        <ul>${problems.form}</ul>
      </div>
      <label for="name">Name</label>
        ${problems.name && `<p style="color:red" >${problems.name}</p>`}
      <input type="text" name="name" id="name" value="${team?.name || ''}" placeholder="name of team"/>

      <label for="description" >Description</label>
      ${problems.description && `<p style="color:red" >${problems.description}</p>`}
      <input type="text" name="description" id="description" value="${team?.description || ''}" placeholder="description"/>

      <label>Members
      ${problems.name && `<p style="color:red" >${problems.name}</p>`}
        ${team?.members?.map(member => `
          <input type="text" name="members" value="${member || ''}" placeholder="email"/>
        `).join('')}
        <input type="text" name="members"  placeholder="email"/>
        <input type="text" name="members"  placeholder="email"/>
        <input type="text" name="members"  placeholder="email"/>
        <input type="text" name="members"  placeholder="email"/>
        <input type="text" name="members"  placeholder="email"/>
      </label>

      <input type="hidden" id="key" name="key" value="${team?.key}" />
      <button type="reset">Reset</button>
      <button type="submit">Save</button>
    </form>
  </main>
</layout-page>

`
}
