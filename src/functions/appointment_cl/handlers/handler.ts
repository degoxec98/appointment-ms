import { SQSEvent } from "aws-lambda";
import { controller } from "../controller";

export const appointmentCL = async (event: SQSEvent) => {
  return await controller.createAppointment(event);
};
