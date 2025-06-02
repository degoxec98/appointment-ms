import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SNSClient } from "@aws-sdk/client-sns";
import { DynamoRepositoryImpl } from "./DynamoRepositoryImpl";
import { SnsRepositoryImpl } from "./SnsRepositoryImpl";

export const dynamoDbRepo = new DynamoRepositoryImpl({
  dynamoDbClient: DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  }),
  config: {
    appointmentsTable: process.env.APPOINTMENT_TABLE!,
  },
})

export const snsRepo = new SnsRepositoryImpl({
  snsClient: new SNSClient({}),
  config: {
    topicArnPE: process.env.SNS_TOPIC_PE!,
    topicArnCL: process.env.SNS_TOPIC_CL!,
  }
});