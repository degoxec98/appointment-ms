import * as lambda from "aws-lambda";
import { AppointmentsService } from "../../../src/functions/appointment/services/AppointmentsService";
import {
 AppointmentsController,
 AppointmentsControllerProps,
} from "../../../src/functions/appointment/controller/AppointmentController";

describe("AppointmentController", () => {
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
      } as unknown as AppointmentsService;

      const controller = new AppointmentsController({
        service: serviceMock,
      } as unknown as AppointmentsControllerProps);

      // Execute
      const response = await controller.createAppointment({
        httpMethod: "POST",
        body: JSON.stringify({
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: "PE",
        }),
      } as unknown as lambda.APIGatewayEvent);

      // Validate
      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify({
            id: "id",
            insuredId: "insuredId",
            scheduleId: 100,
            countryISO: "PE",
            status: "pending",
            creationDate: "2023-10-01T00:00:00Z",
            lastUpdateDate: "2023-10-01T00:00:00Z",
          }),
        }),
      );

      expect(serviceMock.createAppointment).toHaveBeenCalledWith(
        {
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: "PE",
        },
      );
    });
  });

  describe("getAppointmentsByInsuredId", () => {
    it("should return appointments by insuredId", async () => {
      // Prepare
      const serviceMock = {
        getAppointmentsByInsuredId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: "PE",
              status: "pending",
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            },
            {
              id: "id2",
              insuredId: "insuredId",
              scheduleId: 101,
              countryISO: "PE",
              status: "pending",
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            },
          ]),
        ),
      } as unknown as AppointmentsService;

      const controller = new AppointmentsController({
        service: serviceMock,
      } as unknown as AppointmentsControllerProps);

      // Execute
      const response = await controller.getAppointmentsByInsuredId({
        httpMethod: "GET",
        pathParameters: { insuredId: "insuredId" },
      } as unknown as lambda.APIGatewayEvent);

      // Validate
      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify([
              {
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: "PE",
              status: "pending",
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            },
            {
              id: "id2",
              insuredId: "insuredId",
              scheduleId: 101,
              countryISO: "PE",
              status: "pending",
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            },
          ]),
        }),
      );

      expect(serviceMock.getAppointmentsByInsuredId).toHaveBeenCalledWith(
        {
          insuredId: "insuredId",
        },
      );
    });
  });

  describe("updateAppointment", () => {
    it("should update appointment", async () => {
      // Prepare
      const serviceMock = {
        updateAppointment: jest.fn(() => Promise.resolve()),
      } as unknown as AppointmentsService;

      const controller = new AppointmentsController({
        service: serviceMock,
      } as unknown as AppointmentsControllerProps);

      // Execute
      await controller.updateAppointment({
        Records: [{
          body: JSON.stringify({
            detail: {
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
      expect(serviceMock.updateAppointment).toHaveBeenCalledWith(
        {
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: "PE",
          status: "pending",
        },
      );
    });
  });
});
