export const Account = {
  "id": "Accounts",
  "type": "object",
  "required": [
    "displayName", "password"
  ],
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "displayName": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_\-]*$",
      "maxLength": 30
    },
    "password": {
      "type": "string",
      "minLength": 8
    },
    "phone": {
      "type": "string",
      "format": "[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
