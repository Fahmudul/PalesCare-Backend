import { Router } from "express";
import { PrescriptionControllers } from "./Prescription.controllers";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();
router.post(
  "/create",
  AuthGurd(UserRole.DOCTOR),
  PrescriptionControllers.createPrescription
);

export const PrescriptionRoutes = router;
