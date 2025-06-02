
import { Appointment } from "../../../domains/Appointment";
import { EventBridgeRepository } from "../repositories/EventBridgeRepository";
import { MySqlRepository } from "../repositories/MySqlRepository";
import { AppointmentsClService } from "./AppointmentsClService";


export interface AppointmentsClServiceProps {
  mySqlRepo: MySqlRepository;
  eventBridgeRepo: EventBridgeRepository;
  config: {},
}

export class AppointmentsClServiceImpl implements AppointmentsClService {
  constructor(private props: AppointmentsClServiceProps) {}

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      const appointmentCreated = await this.props.mySqlRepo.createAppointment(appointment);

      await this.props.eventBridgeRepo.sendCreateEvent(appointmentCreated, "AppointmentCreated");
      
      return appointmentCreated;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  }
}