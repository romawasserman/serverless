const AWS = require("aws-sdk")
const ses = new AWS.SES({ region: "us-east-1" })

async function isEmailVerified(email) {
  const params = {
    Identities: [email],
  }

  try {
    const result = await ses.getIdentityVerificationAttributes(params).promise()
    const verificationAttributes = result.VerificationAttributes

    if (verificationAttributes && verificationAttributes[email]) {
      return verificationAttributes[email].VerificationStatus === "Success"
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function sendVerificationEmail(email) {
  const isVerified = await isEmailVerified(email)

  if (!isVerified) {
    const params = {
      EmailAddress: email,
    }

    try {
      await ses.verifyEmailAddress(params).promise()
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const email = "rpoma2154@gmail.com"
sendVerificationEmail(email)
