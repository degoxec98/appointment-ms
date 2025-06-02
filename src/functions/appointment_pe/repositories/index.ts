import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { EventBridgeRepositoryImpl } from "./EventBridgeRepositoryImpl";
import { MySqlRepositoryImpl } from "./MySqlRepositoryImpl";

export const mySqlRepo = new MySqlRepositoryImpl({
  config: {},
});

export const eventBridgeRepo = new EventBridgeRepositoryImpl({
  eventClient: new EventBridgeClient({}),
  config: {
    eventBusName: process.env.EVENT_BUS_NAME!,
  },
})