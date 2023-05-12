export const Account = {
  "id": "Accounts",
  "type": "object",
  "required": [
    "displayName", 
  ],
  "properties": {
    "displayName": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_\-]*$",
      "maxLength": 30
    },
    "username": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_\-]*$",
      "maxLength": 30
    },
    "password": {
      "anyOf": [
        {
          "type": "string",
          "minLength": 8
        },
        {
          "type": "string",
          "maxLength": 0
        }
      ]
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
    "verified":{ 
      "type": "object",
      "properties":{
        "email": {"type":"boolean"},
        "phone": {"type":"boolean"},
      }
    },
    "authConfig":{ 
      "type": "object",
      "properties":{
        "loginWith":{
          "type": "object",
          "properties":{
            "username": {"type":"boolean"},
            "github": {"type":"boolean"},
            "email": {"type":"boolean"},
            "phone": {"type":"boolean"},
          }
        }
      }
    },
    "key": {
      "type": "string"
    }
  }
}
