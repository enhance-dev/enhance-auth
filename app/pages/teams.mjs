
// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html({ html, state }) {
  const { store } = state
  let teams = store.teams || []

  return html`
  <header>
    <nav-menu></nav-menu>
  </header>
  <main>
    <h1>Teams</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Members</th>
            <th> </th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          ${teams.map(item => `<tr>
            <td>${item?.name || ''}</td>
            <td>${item?.description || ''}</td>
            <td>${item?.members?.join(", ") || ''}</td>
            <td> <a href="/teams/${item.key}">Edit</a> </td>
            <td>
              <form action="/teams/${item.key}/delete" method="POST">
                <button>Delete</button>
              </form>
            </td>
          </tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </main>
`
}
