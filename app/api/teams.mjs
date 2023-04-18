import { getTeams } from '../models/teams.mjs'
import enhanceResponse from '../middleware/enhance-response.mjs'
import auth from '../middleware/auth.mjs'
import checkRole from '../middleware/check-role.mjs'

export const get = [auth, checkRole('admin'), sendTeams]

async function sendTeams(req) {
  const response = enhanceResponse(req)
  const teams = await getTeams()

  return response.addData({ teams }).send()
}

