const { generatePolicy } = require('./helpers/authPolicy');
const { decodeAccessToken } = require('./helpers/jwtHelper');

const tokenValidation = async (event) => {
  try {
    const token = event.headers['accesstoken'];
    if (!token) {
      throw new Error('Unauthorized');
    }
    const decodedToken = decodeAccessToken(token)
    return generatePolicy(decodedToken.username, 'Allow', event.routeArn);
  } catch (error) {
    console.log(error);
    return generatePolicy(null, 'Deny', event.routeArn);
  }
};

module.exports = {
  handler: tokenValidation,
}