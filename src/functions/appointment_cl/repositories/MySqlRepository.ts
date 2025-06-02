import { Appointment } from "../../../domains/Appointment";

export interface MySqlRepository {
  createAppointment(appointment: Appointment): Promise<Appointment>;
}