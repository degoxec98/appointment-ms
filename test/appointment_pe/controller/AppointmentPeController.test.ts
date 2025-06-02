import * as lambda from "aws-lambda";
import {
  AppointmentsPeController,
  AppointmentsPeControllerProps,
} from "../../../src/functions/appointment_pe/controller/AppointmentPeController";
import { AppointmentsPeService } from "../../../src/functions/appointment_pe/services/AppointmentsPeService";

describe("AppointmentPeController", () => {
  describe("createAppointment", () => {
    it("should create an appointment", async () => {
      // Prepare
      const serviceMock = {
        createAppointment: jest.fn(() =>
          Promise.resolve({
            id: "id",
            insuredId: "insuredId",
            scheduleId: 100,
            countryISO: "PE",
            status: "pending",
            creationDate: "2023-10-01T00:00:00Z",
            lastUpdateDate: "2023-10-01T00:00:00Z",
          }),
        ),
      } as unknown as AppointmentsPeService;

      const controller = new AppointmentsPeController({
        service: serviceMock,
      } as unknown as AppointmentsPeControllerProps);

      // Execute
      await controller.createAppointment({
        Records: [{
          body: JSON.stringify({
            data: {
              id: "id",
              insuredId: "insuredId",
              status: "pending",
              scheduleId: 100,
              countryISO: "PE",
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
          countryISO: "PE",
        },
      );
    });
  });
});
