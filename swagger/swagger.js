// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "serverless",
    "version": "1"
  },
  "paths": {
    "/getAllLinks": {
      "get": {
        "summary": "getAllUserLinks",
        "description": "",
        "operationId": "getAllUserLinks.get./getAllLinks",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/redirect/{id}": {
      "get": {
        "summary": "linkRedirect",
        "description": "",
        "operationId": "linkRedirect.get./redirect/{id}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/linkShorter": {
      "post": {
        "summary": "linkshorter",
        "description": "",
        "operationId": "linkshorter.post./linkShorter",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/delete/{id}": {
      "post": {
        "summary": "deleteLink",
        "description": "",
        "operationId": "deleteLink.post./delete/{id}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/register": {
      "post": {
        "summary": "addUser",
        "description": "",
        "operationId": "addUser.post./register",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/auth": {
      "post": {
        "summary": "generateTokens",
        "description": "",
        "operationId": "generateTokens.post./auth",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/refresh": {
      "post": {
        "summary": "refreshToken",
        "description": "",
        "operationId": "refreshToken.post./refresh",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {},
  "securityDefinitions": {}
};