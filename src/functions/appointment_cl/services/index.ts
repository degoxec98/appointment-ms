import { AppointmentsClServiceImpl } from "./AppointmentsClServiceImpl";
import { mySqlRepo, eventBridgeRepo } from "../repositories";

export const service = new AppointmentsClServiceImpl({
  mySqlRepo,
  eventBridgeRepo,
  config: {},
});