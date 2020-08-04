import { DynamoDB } from "aws-sdk";

// Depends on serverless-offline plugin which adds IS_OFFLINE to process.env when running offline
const dynamoDb: DynamoDB.DocumentClient = process.env.IS_OFFLINE
  ? new DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:9005",
    })
  : new DynamoDB.DocumentClient();

export default dynamoDb;
