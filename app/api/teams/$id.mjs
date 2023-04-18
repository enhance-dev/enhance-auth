import { getTeam, upsertTeam, validate } from '../../models/teams.mjs'


export async function get(req) {
  if (req.session.problems) {
    let { problems, team, ...session } = req.session
    return {
      session,
      json: { problems, team }
    }
  }

  const id = req.pathParameters?.id
  const result = await getTeam(id)
  return {
    json: { team: result }
  }
}

export async function post(req) {
  const id = req.pathParameters?.id
  const session = req.session
  const owner_id = session.account.account.key // TODO: fix the double account

  const newTeam = {
    key: id,
    owner_id,
    ...req.body,
    members: req.body.members.filter(m => m)
  }
  let { problems, team } = await validate.update(newTeam)
  if (problems) {
    return {
      session: { ...session, problems, team },
      json: { problems, team },
      location: `/teams/${team.key}`
    }
  }

  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, team: removed, ...newSession } = session
  try {
    const result = await upsertTeam(team)
    return {
      session: newSession,
      json: { team: result },
      location: '/teams'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/teams/${team.key}'
    }
  }
}
