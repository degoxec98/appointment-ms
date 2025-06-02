import { Appointment } from "../../../domains/Appointment";
import { DynamoRepository } from "../repositories/DynamoRepository";
import { SnsRepository } from "../repositories/SnsRepository";
import { AppointmentsService } from "./AppointmentsService";


export interface AppointmentsServiceProps {
  dynamoDbRepo: DynamoRepository;
  snsRepo: SnsRepository;
  config: {},
}

export class AppointmentsServiceImpl implements AppointmentsService {
  constructor(private props: AppointmentsServiceProps) {}

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      const appointmentCreated = await this.props.dynamoDbRepo.createAppointment(
        appointment,
      );

      await this.props.snsRepo.notifyAppointmentCreated(appointmentCreated);
      
      return appointmentCreated;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  }

  async getAppointmentsByInsuredId(appointment: Appointment): Promise<Appointment[]> {
    try {
      const appointments = 
        await this.props.dynamoDbRepo.getAppointmentsByInsuredId(appointment.insuredId);
      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw new Error("Failed to fetch appointments");
    }
  }

  async updateAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      const updatedAppointment =
        await this.props.dynamoDbRepo.updateAppointment(appointment);
      return updatedAppointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw new Error("Failed to update appointment");
    }
  }
}