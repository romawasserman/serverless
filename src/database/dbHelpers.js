const AWS = require("aws-sdk")
const dynamodb = new AWS.DynamoDB.DocumentClient()

const addToDb = async (TableName, item) => {
  await dynamodb
    .put({
      TableName: TableName,
      Item: item,
    })
    .promise()
}

const getFromDb = async (tableName, key) => {
  return await dynamodb
    .get({
      TableName: tableName,
      Key: key,
    })
    .promise()
}

const putItemtoDb = async (TableName, item, ConditionExpression) => {
  await dynamodb
    .put({
      TableName: TableName,
      Item: item,
      ConditionExpression: ConditionExpression,
    })
    .promise()
}

const updateIteminDb = async (
  TableName,
  key,
  UpdateExpression,
  ExpressionAttributeValues
) => {
  await dynamodb
    .update({
      TableName: TableName,
      Key: key,
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues,
    })
    .promise()
}
const updateClicks = async (
  TableName,
  key,
  UpdateExpression,
  ExpressionAttributeValues
) => {
  await dynamodb
    .update({
      TableName: TableName,
      Key: key,
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues,
      ExpressionAttributeNames: {
        "#clicked": "clicked",
      },
    })
    .promise()
}

const deleteFromDb = async (TableName, item) => {
  await dynamodb
    .delete({
      TableName: TableName,
      Key: item,
    })
    .promise()
}

const scanItemsDb = async (
  TableName,
  FilterExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
) => {
  const result = await dynamodb
    .scan({
      TableName: TableName,
      FilterExpression: FilterExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
    })
    .promise()
  return result
}

module.exports = {
  addToDb,
  getFromDb,
  putItemtoDb,
  updateIteminDb,
  deleteFromDb,
  scanItemsDb,
  updateClicks
}
