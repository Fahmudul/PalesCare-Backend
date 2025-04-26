import { Router } from "express";
import { ScheduleController } from "./Schedule.controller";

const router = Router();

router.post("/create-schedule", ScheduleController.createSchedule);

export const ScheduleRoutes = router;
