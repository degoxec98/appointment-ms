import { randomUUID } from "crypto";
import { MySqlRepository } from "./MySqlRepository";
import { Appointment } from "../../../domains/Appointment";

export interface MySqlRepositoryProps {
  config: {};
}

export class MySqlRepositoryImpl implements MySqlRepository {
  constructor(private props: MySqlRepositoryProps) {}

  protected getUUID() {
    return randomUUID();
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      console.log("Creating appointment in MySQL:", appointment);
      return appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  }
}