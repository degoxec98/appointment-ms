import { Appointment } from "../../../domains/Appointment";

export interface DynamoRepository {
  getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]>;
  createAppointment(appointment: Appointment): Promise<Appointment>;
  updateAppointment(appointment: Appointment): Promise<Appointment>;
}