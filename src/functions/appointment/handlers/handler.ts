import { controller } from "../controller";

export const appointment = async (event: any) => {
  if (event.httpMethod) {
    const { httpMethod, path } = event;

    if (httpMethod === "POST" && path === "/appointment") {
      console.log("Received event for POST appointment:", JSON.stringify(event, null, 2));
      return controller.createAppointment(event);
    }

    if (httpMethod === "GET" && path.startsWith("/appointment/")) {
      console.log("Received event for GET appointment by insuredId:", JSON.stringify(event, null, 2));
      return controller.getAppointmentsByInsuredId(event);
    }
  }
  
  if (event.Records && event.Records[0].eventSource === "aws:sqs") {
    console.log("Received event from SQS:", JSON.stringify(event, null, 2));
    return controller.updateAppointment(event);
  }

  console.error("Event unsupported type:", JSON.stringify(event));
  return {
    statusCode: 400,
    body: "Event unsupported type"
  };
};
