export const Account = {
  "id": "Accounts",
  "type": "object",
  "required": [
    "displayName", "password"
  ],
  "properties": {
    "displayName": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_\-]*$",
      "maxLength": 30
    },
    "password": {
      "type": "string",
      "minLength": 8
    },
    "email": {
      "anyOf": [
        {
          "type": "string",
          "format": "email"
        },
        {
          "type": "string",
          "maxLength": 0
        }
      ]
    },
    "phone": {
      "anyOf": [
        {
          "type": "string",
          "pattern": "[0-9]{3}-[0-9]{3}-[0-9]{4}"
        },
        {
          "type": "string",
          "maxLength": 0
        }
      ]
    },
    "scopes": {
      "type": "array",
      "items": {"type":"string"}
    },
    "key": {
      "type": "string"
    }
  }
}
