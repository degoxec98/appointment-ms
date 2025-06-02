import { SQSEvent } from "aws-lambda";
import { AppointmentsClService } from "../services/AppointmentsClService";
import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsClControllerProps {
  service: AppointmentsClService;
  config: {};
}

export class AppointmentsClController {
  constructor(protected props: AppointmentsClControllerProps) {}

  async createAppointment(event: SQSEvent) {
    for (const record of event.Records) {
      const { data } = JSON.parse(record.body);
      const appointment = new Appointment({
        id: data.id,
        insuredId: data.insuredId,
        scheduleId: data.scheduleId,
        countryISO: data.countryISO,
        status: data.status,
      })
      await this.props.service.createAppointment(appointment);
    }
    return event;
  }
}