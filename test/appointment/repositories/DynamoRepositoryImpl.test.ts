import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import {
  DynamoRepositoryImpl,
  DynamoRepositoryProps,
} from "../../../src/functions/appointment/repositories/DynamoRepositoryImpl";

class DynamoDbRepositoryImplStub extends DynamoRepositoryImpl {
  protected getUUID(): any {
    return "randomId";
  }

  protected getDate(): any {
    return "2023-10-01T00:00:00Z";
  }
}

describe("DynamoRepositoryImpl", () => {
  describe("createAppointment", () => {
    it("should create an appointment", async () => {
      // Prepare
      const dynamoClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as DynamoDBClient;

      const dynamoRepository = new DynamoDbRepositoryImplStub({
        dynamoDbClient: dynamoClientMock,
        config: { appointmentsTable: "appointments" },
      } as unknown as DynamoRepositoryProps);

      // Execute
      const response = await dynamoRepository.createAppointment(
        new Appointment({
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
        }),
      );

      // Validate
      expect(response).toEqual(
        new Appointment({
          id: "randomId",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
          creationDate: "2023-10-01T00:00:00Z",
          lastUpdateDate: "2023-10-01T00:00:00Z",
        }),
      );

      expect(dynamoClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "appointments",
            Item: expect.objectContaining({
              id: "randomId",
              insuredId: "insuredId",
              scheduleId: 100,
              countryISO: CountryISO.PE,
              status: AppointmentStatus.PENDING,
              creationDate: "2023-10-01T00:00:00Z",
              lastUpdateDate: "2023-10-01T00:00:00Z",
            }),
          },
        }),
      );
    });
  });

  describe("getAppointmentsByInsuredId", () => {
    it("should return appointments by insuredId", async () => {
      // Prepare
      const dynamoClientMock = {
        send: jest.fn(() => Promise.resolve({
          Items: [
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
          ],
        })),
      } as unknown as DynamoDBClient;

      const dynamoRepository = new DynamoDbRepositoryImplStub({
        dynamoDbClient: dynamoClientMock,
        config: { appointmentsTable: "appointments" },
      } as unknown as DynamoRepositoryProps);

      // Execute
      const response = await dynamoRepository.getAppointmentsByInsuredId(
        "insuredId",
      );

      // Validate
      expect(response).toEqual([
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
      ]);

      expect(dynamoClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "appointments",
            KeyConditionExpression: "insuredId = :insuredId",
            ExpressionAttributeValues: {
              ":insuredId": "insuredId",
            },
          },
        }),
      );
    });
  });

  describe("updateAppointment", () => {
    it("should update an appointment", async () => {
      // Prepare
      const dynamoClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as DynamoDBClient;

      const dynamoRepository = new DynamoDbRepositoryImplStub({
        dynamoDbClient: dynamoClientMock,
        config: { appointmentsTable: "appointments" },
      } as unknown as DynamoRepositoryProps);

      // Execute
      const response = await dynamoRepository.updateAppointment(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          status: AppointmentStatus.PENDING,
          scheduleId: 100,
          countryISO: CountryISO.PE,
        }),
      );

      // Validate
      expect(response).toEqual(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.COMPLETED,
          lastUpdateDate: "2023-10-01T00:00:00Z",
        }),
      );

      expect(dynamoClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            ExpressionAttributeNames: {
              "#lastUpdateDate": "lastUpdateDate",
              "#status": "status",
            },
            ExpressionAttributeValues: {
              ":lastUpdateDate": "2023-10-01T00:00:00Z",
              ":status": "completed",
            },
            Key: { id: "id", insuredId: "insuredId" },
            TableName: "appointments",
            ConditionExpression: "attribute_exists(id)",
            UpdateExpression: "SET #status = :status, #lastUpdateDate = :lastUpdateDate",
          },
        }),
      );
    });
  });
});
