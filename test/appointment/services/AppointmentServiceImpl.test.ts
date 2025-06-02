import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import { DynamoRepository } from "../../../src/functions/appointment/repositories/DynamoRepository";
import { SnsRepository } from "../../../src/functions/appointment/repositories/SnsRepository";
import {
  AppointmentsServiceImpl,
  AppointmentsServiceProps,
} from "../../../src/functions/appointment/services/AppointmentsServiceImpl";

describe("AppointmentServiceImpl", () => {
  describe("createAppointment", () => {
    it("should create an appointment", async () => {
      // Prepare
      const dynamoRepoMock = {
        createAppointment: jest.fn(() =>
          Promise.resolve(
            new Appointment({
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.PENDING,
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            }),
          ),
        ),
      } as unknown as DynamoRepository;

      const snsRepoMock = {
        notifyAppointmentCreated: jest.fn(() => Promise.resolve()),
      } as unknown as SnsRepository;

      const service = new AppointmentsServiceImpl({
        dynamoDbRepo: dynamoRepoMock,
        snsRepo: snsRepoMock,
      } as unknown as AppointmentsServiceProps);

      // Execute
      const response = await service.createAppointment(
        new Appointment({
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
        }),
      );

      // Validate
      expect(response).toEqual({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: CountryISO.PE,
        status: AppointmentStatus.PENDING,
        creationDate: "2023-10-01T00:00:00Z",
        lastUpdateDate: "2023-10-01T00:00:00Z",
      });

      expect(dynamoRepoMock.createAppointment).toHaveBeenCalledWith({
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: "PE",
      });

      expect(snsRepoMock.notifyAppointmentCreated).toHaveBeenCalledWith({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: "PE",
        status: AppointmentStatus.PENDING,
        creationDate: "2023-10-01T00:00:00Z",
        lastUpdateDate: "2023-10-01T00:00:00Z",
      });
    });
  });

  describe("getAppointmentsByInsuredId", () => {
    it("should return appointments by insuredId", async () => {
      // Prepare
      const dynamoRepoMock = {
        getAppointmentsByInsuredId: jest.fn(() =>
          Promise.resolve([
            new Appointment({
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.PENDING,
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            }),
            new Appointment({
              id: "id2",
              insuredId: "insuredId",
              scheduleId: 101,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.PENDING,
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            }),
          ]),
        ),
      } as unknown as DynamoRepository;

      const snsRepoMock = {
        notifyAppointmentCreated: jest.fn(() => Promise.resolve()),
      } as unknown as SnsRepository;

      const service = new AppointmentsServiceImpl({
        dynamoDbRepo: dynamoRepoMock,
        snsRepo: snsRepoMock,
      } as unknown as AppointmentsServiceProps);

      // Execute
      const response = await service.getAppointmentsByInsuredId(
        new Appointment({ insuredId: "insuredId" }),
      );

      // Validate
      expect(response).toEqual([
        {
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
          creationDate: "2023-10-01T00:00:00Z",
          lastUpdateDate: "2023-10-01T00:00:00Z",
        },
        {
          id: "id2",
          insuredId: "insuredId",
          scheduleId: 101,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
          creationDate: "2023-10-01T00:00:00Z",
          lastUpdateDate: "2023-10-01T00:00:00Z",
        },
      ]);

      expect(dynamoRepoMock.getAppointmentsByInsuredId).toHaveBeenCalledWith(
        "insuredId",
      );

      expect(snsRepoMock.notifyAppointmentCreated).not.toHaveBeenCalled();
    });
  });

  describe("updateAppointment", () => {
    it("should update an appointment", async () => {
      // Prepare
      const dynamoRepoMock = {
        updateAppointment: jest.fn(() =>
          Promise.resolve(
            new Appointment({
              id: "id",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.COMPLETED,
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            }),
          ),
        ),
      } as unknown as DynamoRepository;

      const snsRepoMock = {
        notifyAppointmentCreated: jest.fn(() => Promise.resolve()),
      } as unknown as SnsRepository;

      const service = new AppointmentsServiceImpl({
        dynamoDbRepo: dynamoRepoMock,
        snsRepo: snsRepoMock,
      } as unknown as AppointmentsServiceProps);

      // Execute
      const response = await service.updateAppointment(
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
        status: AppointmentStatus.COMPLETED,
        creationDate: "2023-10-01T00:00:00Z",
        lastUpdateDate: "2023-10-01T00:00:00Z",
      });

      expect(dynamoRepoMock.updateAppointment).toHaveBeenCalledWith({
        id: "id",
        insuredId: "insuredId",
        scheduleId: 100,
        countryISO: "PE",
        status: AppointmentStatus.PENDING,
      });

      expect(snsRepoMock.notifyAppointmentCreated).not.toHaveBeenCalled();
    });
  });
});
