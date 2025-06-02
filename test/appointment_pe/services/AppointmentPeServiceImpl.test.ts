import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import { MySqlRepository } from "../../../src/functions/appointment_pe/repositories/MySqlRepository";
import { EventBridgeRepository } from "../../../src/functions/appointment_pe/repositories/EventBridgeRepository";
import {
  AppointmentsPeServiceImpl,
  AppointmentsPeServiceProps,
} from "../../../src/functions/appointment_pe/services/AppointmentsPeServiceImpl";


describe("AppointmentPeServiceImpl", () => {
  describe("createAppointment", () => {
    it("should create an appointment", async () => {
      // Prepare
      const mySqlRepoMock = {
        createAppointment: jest.fn(() =>
          Promise.resolve(
            new Appointment({
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.PENDING,
            }),
          ),
        ),
      } as unknown as MySqlRepository;

      const eventBridgeRepoMock = {
        sendCreateEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventBridgeRepository;

      const service = new AppointmentsPeServiceImpl({
        mySqlRepo: mySqlRepoMock,
        eventBridgeRepo: eventBridgeRepoMock,
      } as unknown as AppointmentsPeServiceProps);

      // Execute
      const response = await service.createAppointment(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
        }),
      );

      // Validate
      expect(response).toEqual({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: CountryISO.PE,
        status: AppointmentStatus.PENDING,
      });

      expect(mySqlRepoMock.createAppointment).toHaveBeenCalledWith({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: CountryISO.PE,
        status: AppointmentStatus.PENDING,
      });

      expect(eventBridgeRepoMock.sendCreateEvent).toHaveBeenCalledWith(
        {
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: "PE",
          status: AppointmentStatus.PENDING,
        },
        "AppointmentCreated",
      );
    });
  });
});
