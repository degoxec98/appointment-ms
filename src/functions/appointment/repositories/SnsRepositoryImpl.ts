import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SnsRepository } from "./SnsRepository";
import { Appointment } from "../../../domains/Appointment";

export interface SnsRepositoryProps {
  snsClient: SNSClient;
  config: {
    topicArnPE: string;
    topicArnCL: string;
  },
}

export class SnsRepositoryImpl implements SnsRepository {
  constructor(private props: SnsRepositoryProps) {}
  
  private getTopicArn(appointment: Appointment): string {
    return appointment.isCountryPE()
      ? this.props.config.topicArnPE
      : this.props.config.topicArnCL;
  }

  async notifyAppointmentCreated(appointment: Appointment): Promise<void> {
   try {
     const  topicArn = this.getTopicArn(appointment);

     await this.props.snsClient.send(
       new PublishCommand({
         TopicArn: topicArn,
         Message: JSON.stringify({
           event: "APPOINTMENT_CREATED",
           data: appointment,
         }),
       }),
     );
   } catch (error) {
     console.error("Error notifying about appointment creation:", error);
     throw new Error("Failed to notify about appointment creation");
   }
  }
}