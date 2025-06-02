import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { DynamoRepository } from "./DynamoRepository";
import { Appointment, AppointmentStatus } from "../../../domains/Appointment";

export interface DynamoRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    appointmentsTable: string;
  };
}

export class DynamoRepositoryImpl implements DynamoRepository {
  constructor(private props: DynamoRepositoryProps) {}

  protected getUUID() {
    return randomUUID();
  }

  protected getDate() {
    return DateTime.utc().toFormat("yyyy-dd-MM'T'HH:mm:ss'Z'");
  }

  async getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {
    try {
      const params = {
        TableName: this.props.config.appointmentsTable,
        KeyConditionExpression: "insuredId = :insuredId",
        ExpressionAttributeValues: {
          ":insuredId": insuredId,
        },
      };
  
      const { Items: items } = await this.props.dynamoDbClient.send(
        new QueryCommand(params),
      );
      if (items && items.length) {
        return items.map((item) => this.unmarshalAppointment(item));
      }
      return [];
    } catch (error) {
      console.error("Error get appointments:", error);
      throw new Error("Failed to get appointments");
    }
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      const request = {
        ...appointment,
        id: this.getUUID(),
        status: AppointmentStatus.PENDING,
        creationDate: this.getDate(),
        lastUpdateDate: this.getDate(),
      };
  
      await this.props.dynamoDbClient.send(
        new PutCommand({
          TableName: this.props.config.appointmentsTable,
          Item: request,
        }),
      );
      return new Appointment(request);
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  }

  async updateAppointment(appointment: Appointment): Promise<Appointment> {
    try {
      const request = {
        status: AppointmentStatus.COMPLETED,
        lastUpdateDate: this.getDate(),
      }
      const updateExpression = this.getUpdateExpression(request, [
        "status",
        "lastUpdateDate",
      ])
  
      await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.appointmentsTable,
          Key: {
            id: appointment.id,
            insuredId: appointment.insuredId,
          },
          ConditionExpression: "attribute_exists(id)",
          ...updateExpression,
        }),
      );
      return new Appointment({
        ...appointment,
        ...request,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw new Error("Failed to update appointment");
    }
  }

  private getUpdateExpression<T extends object>(
    domain: T,
    attributes: (keyof T)[],
  ) {
    const attrToUpdate = attributes.filter(
      (key) => domain[key as keyof T] !== undefined,
    );

    if (attrToUpdate.length === 0) {
      return undefined;
    }

    return attrToUpdate.reduce(
      (prev, curr, index) => {
        const key = String(curr);
        return {
          UpdateExpression: `${prev.UpdateExpression}${
            index === 0 ? "" : ","
          } #${key} = :${key}`,
          ExpressionAttributeNames: {
            ...prev.ExpressionAttributeNames,
            [`#${key}`]: curr,
          },
          ExpressionAttributeValues: {
            ...prev.ExpressionAttributeValues,
            [`:${key}`]: domain[curr],
          },
        };
      },
      {
        UpdateExpression: "SET",
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {},
      },
    );
  }

  private unmarshalAppointment(item: Record<string, any>): Appointment {
    return new Appointment({
      id: item.id,
      insuredId: item.insuredId,
      scheduleId: item.scheduleId,
      countryISO: item.countryISO,
      status: item.status,
      creationDate: item.creationDate,
      lastUpdateDate: item.lastUpdateDate,
    });
  }
}