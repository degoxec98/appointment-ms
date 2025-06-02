
import { Appointment } from "../../../domains/Appointment";
import { EventBridgeRepository } from "../repositories/EventBridgeRepository";
import { MySqlRepository } from "../repositories/MySqlRepository";
import { AppointmentsPeService } from "./AppointmentsPeService";


export interface AppointmentsPeServiceProps {
  mySqlRepo: MySqlRepository;
  eventBridgeRepo: EventBridgeRepository;
  config: {},
}

export class AppointmentsPeServiceImpl implements AppointmentsPeService {
  constructor(private props: AppointmentsPeServiceProps) {}

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