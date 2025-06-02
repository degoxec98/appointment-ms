import { Appointment } from "../../../domains/Appointment";

export interface SnsRepository {
  notifyAppointmentCreated(appointment: Appointment): Promise<void>;
}