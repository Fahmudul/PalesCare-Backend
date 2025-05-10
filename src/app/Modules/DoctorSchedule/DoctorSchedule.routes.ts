import { Router } from "express";
import { DoctorScheduleControllers } from "./DoctorSchedule.controller";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  AuthGurd(UserRole.DOCTOR),
  DoctorScheduleControllers.getAllSchedules
);
router.get(
  "/:id",
  AuthGurd(UserRole.DOCTOR),
  DoctorScheduleControllers.getMyDoctorSchedule
);
router.post(
  "/create",
  AuthGurd(UserRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);
router.delete(
  "/:id",
  AuthGurd(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteDoctorSchedule
);

export const DoctorScheduleRoutes = router;
