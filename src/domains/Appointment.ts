import Joi from "joi";
import { HttpError } from "./HttpError";

export enum CountryISO {
  PE = "PE",
  CL = "CL",
}

export enum AppointmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

const appointmentCreateSchema = Joi.object({
  insuredId: Joi.string().required(),
  scheduleId: Joi.number().required(),
  countryISO: Joi.string().valid(...Object.values(CountryISO)).required(),
});

const appointmentUpdateSchema = Joi.object({
  id: Joi.string().required(),
  insuredId: Joi.string().required(),
  scheduleId: Joi.number().required(),
  countryISO: Joi.string().valid(...Object.values(CountryISO)).required(),
  status: Joi.string()
    .valid(...Object.values(AppointmentStatus))
    .required(),
});

const appointmentGetSchema = Joi.object({
  insuredId: Joi.string().required(),
});

export class Appointment {
  id: string;

  insuredId: string;

  scheduleId: number;

  countryISO: CountryISO;

  status: AppointmentStatus;

  creationDate: string;

  lastUpdateDate: string;
  
  constructor(data?: Partial<Appointment>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceForCreate(data?: Partial<Appointment>) {
    const { error } = appointmentCreateSchema.validate(data, { convert: false });
    if (error) {
      throw new HttpError({
        statusCode: 400,
        message: `Invalid appointment data: ${error.message}`, 
      });
    }
    return new Appointment(data);
  }

  static instanceForUpdate(data?: Partial<Appointment>) {
    const { error } = appointmentUpdateSchema.validate(data, { convert: false });
    if (error) {
      throw new HttpError({
        statusCode: 400,
        message: `Invalid appointment update data: ${error.message}`,
      });
    }
    return new Appointment(data);
  }

  static instanceForGet(data?: Partial<Appointment>) {
    const { error } = appointmentGetSchema.validate(data, { convert: false });
    if (error) {
      throw new HttpError({
        statusCode: 400,
        message: `Invalid appointment get data: ${error.message}`,
      });
    }
    return new Appointment(data);
  }

  isCountryPE(): boolean {
    return this.countryISO === CountryISO.PE;
  }
}