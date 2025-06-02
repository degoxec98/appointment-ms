import { Appointment } from "../../../domains/Appointment";

export interface AppointmentsPeService {
  createAppointment(appointment: Appointment): Promise<Appointment>;
}