import express from "express";
import { AppointmentController } from "./Appointment.controller";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-appointment",
  AuthGurd(UserRole.PATIENT),
  AppointmentController.createAppointment
);

router.get(
  "/my-appointment",
  AuthGurd(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.patch(
  "/status/:id",
  AuthGurd(UserRole.PATIENT, UserRole.DOCTOR, UserRole.SUPER_ADMIN),
  AppointmentController.changeAppointmentStatus
);

export const AppointmentRoutes = router;
