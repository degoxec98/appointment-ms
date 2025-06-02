import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment-ms",
  frameworkVersion: "3.38.0",
  configValidationMode: "error",
  plugins: [
    "serverless-esbuild",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "dev",
    environment: {
      APPOINTMENT_TABLE: "AppointmentTable",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SNS_TOPIC_PE: { Ref: "AppointmentCreatedTopicPE" },
      SNS_TOPIC_CL: { Ref: "AppointmentCreatedTopicCL" },
      EVENT_BUS_NAME: { Ref: "AppointmentEventBus" },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
        ],
        Resource: { "Fn::GetAtt": ["AppointmentTable", "Arn"] },
      },
      {
        Effect: "Allow",
        Action: "events:PutEvents",
        Resource: "*",
      },
      {
        Effect: "Allow",
        Action: [
          "sns:publish",
        ],
        Resource: [
          { Ref: "AppointmentCreatedTopicPE" },
          { Ref: "AppointmentCreatedTopicCL" },
        ],
      },
      {
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ],
        Resource: [
          { "Fn::GetAtt": ["AppointmentQueuePE", "Arn"] },
          { "Fn::GetAtt": ["AppointmentQueueCL", "Arn"] },
          { "Fn::GetAtt": ["AppointmentCreatedQueue", "Arn"] },
        ],
      },
    ]
  },

  functions: {
    appointment: {
      handler: "src/functions/appointment/handlers/handler.appointment",
      events: [
        {
          http: {
            path: "appointment",
            method: "post",
            cors: true
          }
        },
        {
          http: {
            path: "appointment/{insuredId}",
            method: "get",
            cors: true
          }
        },
        {
          sqs: {
            arn: { "Fn::GetAtt": ["AppointmentCreatedQueue", "Arn"] },
            batchSize: 1
          }
        }
      ],
    },
    appointment_pe: {
      handler: "src/functions/appointment_pe/handlers/handler.appointmentPE",
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["AppointmentQueuePE", "Arn"] },
            batchSize: 1
          }
        }
      ],
    },
    appointment_cl: {
      handler: "src/functions/appointment_cl/handlers/handler.appointmentCL",
      events: [
        {
          sqs: {
            arn: { "Fn::GetAtt": ["AppointmentQueueCL", "Arn"] },
            batchSize: 1
          }
        }
      ],
    },
  },

  resources: {
    Resources: {
      AppointmentTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "AppointmentTable",
          AttributeDefinitions: [
            { AttributeName: "insuredId", AttributeType: "S" },
            { AttributeName: "id", AttributeType: "S" }
          ],
          KeySchema: [
            { AttributeName: "insuredId", KeyType: "HASH" },
            { AttributeName: "id", KeyType: "RANGE" }
          ],
          BillingMode: "PAY_PER_REQUEST"
        }
      },
      AppointmentCreatedTopicPE: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "AppointmentCreatedTopicPE"
        }
      },
      AppointmentCreatedTopicCL: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "AppointmentCreatedTopicCL"
        }
      },
      AppointmentQueuePE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "AppointmentQueuePE"
        }
      },
      AppointmentQueueCL: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "AppointmentQueueCL"
        }
      },
      AppointmentSubscriptionPE: {
        Type: "AWS::SNS::Subscription",
        DependsOn: ["AppointmentQueuePE", "SQSPolicyPE"],
        Properties: {
          Protocol: "sqs",
          TopicArn: { Ref: "AppointmentCreatedTopicPE" },
          Endpoint: { "Fn::GetAtt": ["AppointmentQueuePE", "Arn"] },
          RawMessageDelivery: true
        }
      },
      AppointmentSubscriptionCL: {
        Type: "AWS::SNS::Subscription",
        DependsOn: ["AppointmentQueueCL", "SQSPolicyCL"],
        Properties: {
          Protocol: "sqs",
          TopicArn: { Ref: "AppointmentCreatedTopicCL" },
          Endpoint: { "Fn::GetAtt": ["AppointmentQueueCL", "Arn"] },
          RawMessageDelivery: true
        }
      },
      SQSPolicyPE: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "AppointmentQueuePE" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "sns.amazonaws.com" },
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["AppointmentQueuePE", "Arn"] },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "AppointmentCreatedTopicPE" }
                  }
                }
              }
            ]
          }
        }
      },
      SQSPolicyCL: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "AppointmentQueueCL" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "sns.amazonaws.com" },
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["AppointmentQueueCL", "Arn"] },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "AppointmentCreatedTopicCL" }
                  }
                }
              }
            ]
          }
        }
      },
      AppointmentEventBus: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "AppointmentEventBus"
        },
      },
      AppointmentCreatedQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "AppointmentCreatedQueue"
        }
      },
      AppointmentBusRule: {
        Type: "AWS::Events::Rule",
        DependsOn: ["AppointmentCreatedQueue"],
        Properties: {
          Name: "AppointmentBusRule",
          EventBusName: { Ref: "AppointmentEventBus" },
          EventPattern: {
            source: ["appointment.pe", "appointment.cl"],
          },
          Targets: [
            {
              Arn: {
                "Fn::GetAtt": ["AppointmentCreatedQueue", "Arn"]
              },
              Id: "SendToStoredQueue"
            }
          ]
        }
      },
      AppointmentBusQueuePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "AppointmentCreatedQueue" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "events.amazonaws.com" },
                Action: "sqs:SendMessage",
                Resource: {
                  "Fn::GetAtt": ["AppointmentCreatedQueue", "Arn"]
                },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": {
                      "Fn::GetAtt": ["AppointmentBusRule", "Arn"]
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  },

  package: {
    individually: true
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
