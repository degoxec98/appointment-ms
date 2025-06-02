import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import { EventBridgeRepositoryImpl, EventBridgeRepositoryProps } from "../../../src/functions/appointment_pe/repositories/EventBridgeRepositoryImpl";


describe("EventBridgeRepositoryImpl", () => {
  describe("sendCreateEvent", () => {
    it("should send create event", async () => {
      // Prepare
      const eventBridgeClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as EventBridgeClient;

      const eventBridgeRepository = new EventBridgeRepositoryImpl({
        eventClient: eventBridgeClientMock,
        config: {
          eventBusName: "eventBusName",
        },
      } as unknown as EventBridgeRepositoryProps);

      // Execute
      const response = await eventBridgeRepository.sendCreateEvent(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
        }),
        "AppointmentCreated",
      );

      // Validate
      expect(response).toBeUndefined();

      expect(eventBridgeClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Entries: [
              expect.objectContaining({
                Detail: JSON.stringify({
                  id: "id",
                  insuredId: "insuredId",
                  scheduleId: 100,
                  countryISO: CountryISO.PE,
                  status: AppointmentStatus.PENDING,
                }),
                DetailType: "AppointmentCreated",
                Source: "appointment.pe",
                EventBusName: "eventBusName",
              }),
            ],
          },
        }),
      );
    });
  });
});
