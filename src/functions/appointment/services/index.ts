import { AppointmentsServiceImpl } from "./AppointmentsServiceImpl";
import { dynamoDbRepo, snsRepo } from "../repositories";

export const service = new AppointmentsServiceImpl({
  dynamoDbRepo,
  snsRepo,
  config: {},
});