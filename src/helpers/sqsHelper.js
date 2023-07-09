const AWS = require("aws-sdk")
const sqs = new AWS.SQS()

const sendSQSMessage = async (queueUrl, id, Item) => {
  await sqs
    .sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        email: Item.email,
        msg: `Your link ${id}, that refers to ${Item.originalUrl} is deleted`,
        subject: `Link deactivation`,
      }),
    })
    .promise()
}

module.exports = {
  sendSQSMessage,
}
