const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId: principalId || "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      email: principalId,
    },
  }
  return authResponse
}

module.exports = {
  generatePolicy,
}
