import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsClService {
  createAppointment(appointment: Appointment): Promise<Appointment>;
}