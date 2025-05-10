import { Router } from "express";
import { ScheduleController } from "./Schedule.controller";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", AuthGurd(UserRole.DOCTOR), ScheduleController.getAllSchedules);
router.get(
  "/:id",
  AuthGurd(UserRole.DOCTOR),
  ScheduleController.getScheduleById
);
router.delete(
  "/:id",
  AuthGurd(UserRole.DOCTOR),
  ScheduleController.deleteSchedule
);

router.post(
  "/create-schedule",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.createSchedule
);

export const ScheduleRoutes = router;
