import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from "aws-lambda";
import { AppointmentsService } from "../services/AppointmentsService";
import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsControllerProps {
  service: AppointmentsService;
  config: {};
}

export class AppointmentsController {
  constructor(protected props: AppointmentsControllerProps) {}

  async createAppointment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body || "{}");
    const appointment = Appointment.instanceForCreate({
      insuredId: body.insuredId,
      scheduleId: body.scheduleId,
      countryISO: body.countryISO,
    });
    const result = await this.props.service.createAppointment(appointment);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  async getAppointmentsByInsuredId(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const insuredId = event.pathParameters?.insuredId;
    const appointment = Appointment.instanceForGet({ insuredId });
    const result = await this.props.service.getAppointmentsByInsuredId(appointment);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  async updateAppointment(event: SQSEvent) {
    for (const record of event.Records) {
      const { detail } = JSON.parse(record.body);
      const appointment = Appointment.instanceForUpdate({
        id: detail.id,
        insuredId: detail.insuredId,
        scheduleId: detail.scheduleId,
        countryISO: detail.countryISO,
        status: detail.status,
      });
      await this.props.service.updateAppointment(appointment);
    }
    return event;
  }
}