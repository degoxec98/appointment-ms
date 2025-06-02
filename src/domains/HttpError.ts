export class HttpError extends Error {
  statusCode: number;

  constructor(error: { message: string, statusCode: number }) {
    super(error.message);
    this.name = "HttpError";
    this.statusCode = error.statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
