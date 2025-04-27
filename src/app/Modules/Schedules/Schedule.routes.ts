import { Router } from "express";
import { ScheduleController } from "./Schedule.controller";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", AuthGurd(UserRole.DOCTOR), ScheduleController.getAllSchedules);

router.post(
  "/create-schedule",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.createSchedule
);

export const ScheduleRoutes = router;
