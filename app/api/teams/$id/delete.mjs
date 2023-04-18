import { deleteTeam } from '../../../models/teams.mjs'

export async function post (req) {
  const id = req.pathParameters?.id

  const session = req.session
  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, team: removed, ...newSession } = session
  try {
    await deleteTeam(id)
    return {
      session: newSession,
      json: null,
      location: '/teams'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/teams'
    }
  }
}
