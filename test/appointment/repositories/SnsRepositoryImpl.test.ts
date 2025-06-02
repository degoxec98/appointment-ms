import { SNSClient } from "@aws-sdk/client-sns";
import {
  Appointment,
  AppointmentStatus,
  CountryISO,
} from "../../../src/domains/Appointment";
import {
  SnsRepositoryImpl,
  SnsRepositoryProps,
} from "../../../src/functions/appointment/repositories/SnsRepositoryImpl";

describe("SnsRepositoryImpl", () => {
  describe("notifyAppointmentCreated", () => {
    it("should notify appointment created", async () => {
      // Prepare
      const snsClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as SNSClient;

      const snsRepository = new SnsRepositoryImpl({
        snsClient: snsClientMock,
        config: {
          topicArnPE: "topicArnPE",
          topicArnCL: "topicArnCL",
        },
      } as unknown as SnsRepositoryProps);

      // Execute
      const response = await snsRepository.notifyAppointmentCreated(
        new Appointment({
          id: "id",
          insuredId: "insuredId",
          scheduleId: 100,
          countryISO: CountryISO.PE,
          status: AppointmentStatus.PENDING,
        }),
      );

      // Validate
      expect(response).toBeUndefined();

      expect(snsClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Message: JSON.stringify({
              event: "APPOINTMENT_CREATED",
              data: {
                id: "id",
                insuredId: "insuredId",
                scheduleId: 100,
                countryISO: CountryISO.PE,
                status: AppointmentStatus.PENDING,
              },
            }),
            TopicArn: "topicArnPE",
          },
        }),
      );
    });
  });
});
