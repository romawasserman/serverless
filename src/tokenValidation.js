const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
  try {
    const token = event.headers['accesstoken'];
    if (!token) {
      throw new Error('Unauthorized');
    }
    const decodedToken = jwt.verify(token, 'secret-key');
    console.log('all is good ')
    return generatePolicy(decodedToken.username, 'Allow', event.routeArn);
  } catch (error) {
    console.log(error);
    return generatePolicy(null, 'Deny', event.routeArn);
  }
};

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId: principalId || 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    "context": {
      'email': principalId
    }
  };
  console.log('Policy Document:');
  console.dir(authResponse.policyDocument, { depth: null });
  return authResponse;
};
