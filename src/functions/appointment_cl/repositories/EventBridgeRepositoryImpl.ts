import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { randomUUID } from "crypto";
import { EventBridgeRepository } from "./EventBridgeRepository";
import { Appointment } from "../../../domains/Appointment";

export interface EventBridgeRepositoryProps {
  eventClient: EventBridgeClient;
  config: {
    eventBusName: string;
  };
}

export class EventBridgeRepositoryImpl implements EventBridgeRepository {
  constructor(private props: EventBridgeRepositoryProps) {}

  protected getUUID() {
    return randomUUID();
  }

  async sendCreateEvent(appointment: Appointment, resource: string): Promise<void> {
    try {
      await this.props.eventClient.send(
        new PutEventsCommand({
          Entries: [
            {
              EventBusName: this.props.config.eventBusName,
              Source: "appointment.cl",
              DetailType: resource,
              Detail: JSON.stringify(appointment),
            },
          ],
        }),
      );
      return;
    } catch (error) {
      console.error("Error send event:", error);
      throw new Error("Failed to event for create");
    }
  }
}