import { AppointmentServices } from "./app/Modules/Appointment/Appointment.Services";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import applicationRoutes from "./app/Routes";
import cron from "node-cron";
import router from "./app/Routes";
import { GlobalErrorHandler } from "./app/Error/GlobalError";
import { sendResponse } from "./app/Utils/sendResponse";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);

app.use("/api/v1", router);
cron.schedule('* * * * *', () => {
  AppointmentServices.cancelUnpaidAppointments();
  // console.log('running every minute 1, 2, 4 and 5');
});
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});  
 
app.use(GlobalErrorHandler);
     
app.use((req: Request, res: Response, next: Function) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Api Not Found",
  });
});
export default app;
