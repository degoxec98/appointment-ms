import { service } from "../services";
import { AppointmentsClController } from "./AppointmentClController";

export const controller = new AppointmentsClController({
  service,
  config: {},
});