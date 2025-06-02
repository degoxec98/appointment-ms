import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import { MySqlRepository } from "../../../src/functions/appointment_cl/repositories/MySqlRepository";
import { EventBridgeRepository } from "../../../src/functions/appointment_cl/repositories/EventBridgeRepository";
import {
  AppointmentsClServiceImpl,
  AppointmentsClServiceProps,
} from "../../../src/functions/appointment_cl/services/AppointmentsClServiceImpl";


describe("AppointmentClServiceImpl", () => {
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
              countryISO: CountryISO.CL,
              status: AppointmentStatus.PENDING,
            }),
          ),
        ),
      } as unknown as MySqlRepository;

      const eventBridgeRepoMock = {
        sendCreateEvent: jest.fn(() => Promise.resolve()),
      } as unknown as EventBridgeRepository;

      const service = new AppointmentsClServiceImpl({
        mySqlRepo: mySqlRepoMock,
        eventBridgeRepo: eventBridgeRepoMock,
      } as unknown as AppointmentsClServiceProps);

      // Execute
      const response = await service.createAppointment(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.CL,
          status: AppointmentStatus.PENDING,
        }),
      );

      // Validate
      expect(response).toEqual({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: CountryISO.CL,
        status: AppointmentStatus.PENDING,
      });

      expect(mySqlRepoMock.createAppointment).toHaveBeenCalledWith({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: CountryISO.CL,
        status: AppointmentStatus.PENDING,
      });

      expect(eventBridgeRepoMock.sendCreateEvent).toHaveBeenCalledWith(
        {
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: "CL",
          status: AppointmentStatus.PENDING,
        },
        "AppointmentCreated",
      );
    });
  });
});
