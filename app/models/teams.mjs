import data from '@begin/data'
import Ajv from "ajv"

const deleteTeam = async function(key) {
  return data.destroy({ table: 'teams', key })
}

const upsertTeam = async function(team) {
  return data.set({ table: 'teams', ...team })
}

const getTeam = async function(key) {
  return data.get({ table: 'teams', key })
}

const getTeams = async function() {
  return data.get({ table: 'teams' })
}

const validate = {
  async create(team) {
    const schema = {
      type: "object",
      id: "Team",
      properties: {
        name: {
          type: "string"
        },
        owner_id: {
          type: "string"
        },
        description: { type: "string" },
        members: { type: "array", items: { type: "string" } },
      },
      required: ["name", "owner_id"],
      additionalProperties: false
    }
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(team)
    return valid ? { team } : { problems: 'there is a problem', team }
  },
  async update(team) {
    const schema = {
      type: "object",
      id: "Team",
      properties: {
        name: {
          type: "string"
        },
        owner_id: {
          type: "string"
        },
        key: {
          type: "string"
        },
        description: { type: "string" },
        members: { type: "array", items: { type: "string" } },
      },
      required: ["name", "owner_id", "key"],
      additionalProperties: false
    }

    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(team)
    return !valid ? { problems: 'there is a problem', team } : { team }
  }
}

export {
  deleteTeam,
  getTeam,
  getTeams,
  upsertTeam,
  validate
}


