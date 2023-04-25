export const Register = {
  "id": "Register",
  "type": "object",
  "required": [
    "email", "displayName", "password"
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
      "minLength": 6
    },
    "phone": {
      "type": "string",
      "format": "[0-9]{3}-[0-9]{3}-[0-9]{4}"
    }
  }
}
