const AWS = require('aws-sdk');
const ses = new AWS.SES();

const sesSender = function (event, context) {
  for (const message of event.Records) {
    const bodyData = JSON.parse(message.body);

    const recipientEmail = bodyData.email;
    const emailContent = bodyData.msg;
    const subject = bodyData.subject

    const params = {
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Text: { Data: emailContent },
        },
        Subject: { Data: subject }, 
      },
      Source: process.env.EMAIL, 
    };

    ses.sendEmail(params, function (err, data) {
      if (err) {
        console.log('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', data);
      }
    });
  }
};
module.exports = {
  handler: sesSender,
}

