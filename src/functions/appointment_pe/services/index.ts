import { AppointmentsPeServiceImpl } from "./AppointmentsPeServiceImpl";
import { mySqlRepo, eventBridgeRepo } from "../repositories";

export const service = new AppointmentsPeServiceImpl({
  mySqlRepo,
  eventBridgeRepo,
  config: {},
});