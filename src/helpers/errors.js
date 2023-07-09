const defaultError = () => {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Internal server error" }),
  }
}
const customError = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message }),
  }
}

module.exports = {
  defaultError,
  customError,
}
