import { service } from "../services";
import { AppointmentsPeController } from "./AppointmentPeController";

export const controller = new AppointmentsPeController({
  service,
  config: {},
});