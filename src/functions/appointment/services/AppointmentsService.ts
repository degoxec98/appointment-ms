import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsService {
  createAppointment(appointment: Appointment): Promise<Appointment>;
  getAppointmentsByInsuredId(appointment: Appointment): Promise<Appointment[]>;
  updateAppointment(appointment: Appointment): Promise<Appointment>;
}