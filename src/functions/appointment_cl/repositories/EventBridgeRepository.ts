import { Appointment } from "../../../domains/Appointment";

export interface EventBridgeRepository {
  sendCreateEvent(appointment: Appointment, resource: string): Promise<void>;
}