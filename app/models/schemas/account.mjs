export const Account = {
  "id": "Accounts",
  "type": "object",
  "required": [
    "email"
  ],
  "properties": {
    "displayName": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "key": {
      "type": "string"
    }
  }
}
