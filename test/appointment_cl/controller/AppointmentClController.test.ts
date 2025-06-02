import * as lambda from "aws-lambda";
import {
  AppointmentsClController,
  AppointmentsClControllerProps,
} from "../../../src/functions/appointment_cl/controller/AppointmentClController";
import { AppointmentsClService } from "../../../src/functions/appointment_cl/services/AppointmentsClService";

describe("AppointmentClController", () => {
  describe("createAppointment", () => {
    it("should create an appointment", async () => {
      // Prepare
      const serviceMock = {
        createAppointment: jest.fn(() =>
          Promise.resolve({
            id: "id",
            insuredId: "insuredId",
            scheduleId: 100,
            countryISO: "CL",
            status: "pending",
            creationDate: "2023-10-01T00:00:00Z",
            lastUpdateDate: "2023-10-01T00:00:00Z",
          }),
        ),
      } as unknown as AppointmentsClService;

      const controller = new AppointmentsClController({
        service: serviceMock,
      } as unknown as AppointmentsClControllerProps);

      // Execute
      await controller.createAppointment({
        Records: [{
          body: JSON.stringify({
            data: {
              id: "id",
              insuredId: "insuredId",
              status: "pending",
              scheduleId: 100,
              countryISO: "CL",
            },
          }),
        }],
      } as unknown as lambda.SQSEvent);

      // Validate
      expect(serviceMock.createAppointment).toHaveBeenCalledWith(
        {
          id: "id",
          insuredId: "insuredId",
          status: "pending",
          scheduleId: 100,
          countryISO: "CL",
        },
      );
    });
  });
});
