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
    <form action="/teams/new" method="POST">
      <h3>New Team</h3>
      <div class="${problems.form ? 'block' : 'hidden'}">
        <p>Found some problems!</p>
        <ul>${problems.form}</ul>
      </div>
      <label for="name">Name</label>
        ${problems.name && `<p style="color:red" >${problems.name}</p>`}
        <input type="text" name="name" id="name" value="${team?.name || ''}"  placeholder="name of team"/>
        <label for="description">Description</label>
        ${problems.description && `<p style="color:red" >${problems.description}</p>`}
        <input type="text" name="description" id="description" value="${team?.description || ''}" placeholder="description"/>
        <label>Members
        ${problems.name && `<p style="color:red" >${problems.name}</p>`}
        <div class="mt-1">
          ${team?.members?.map(member => ` <input type="text" name="members" value="${member || ''}" placeholder="email"/>
          `).join('')}
          <input type="text" name="members"  placeholder="email"/>
          <input type="text" name="members"  placeholder="email"/>
          <input type="text" name="members"  placeholder="email"/>
          <input type="text" name="members"  placeholder="email"/>
          <input type="text" name="members"  placeholder="email"/>
        </label>
      <button type="reset" >Reset</button>
      <button type="submit" >Save</button>
    </form>
  </main>
</layout-page>

  `
}
