import { service } from "../services";
import { AppointmentsController } from "./AppointmentController";

export const controller = new AppointmentsController({
  service,
  config: {},
});