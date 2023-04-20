import { upsertTeam, validate } from '../../models/teams.mjs'


export async function get(req) {
  if (req.session.problems) {
    let { problems, team, ...session } = req.session
    return {
      session,
      json: { problems, team }
    }
  }
}

export async function post(req) {
  const session = req.session
  const owner_id = session.account.key // TODO: fix the double account

  const newTeam = { owner_id, ...req.body, member: req.body.members.filter(m => m) }
  let { problems, team } = await validate.create(newTeam)
  if (problems) {
    return {
      session: { ...session, problems, team },
      json: { problems, team },
      location: '/team/new'
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
      location: '/teams/new'
    }
  }
}
