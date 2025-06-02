import { SQSEvent } from "aws-lambda";
import { AppointmentsPeService } from "../services/AppointmentsPeService";
import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsPeControllerProps {
  service: AppointmentsPeService;
  config: {};
}

export class AppointmentsPeController {
  constructor(protected props: AppointmentsPeControllerProps) {}

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