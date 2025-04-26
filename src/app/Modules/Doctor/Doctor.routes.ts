import { Router } from "express";
import { DoctorControllers } from "./Doctor.controller";
import validateRequest from "../../Middlewares/validateRequest";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";
import { DoctorValidationSchemas } from "./Doctor.validations";

const router = Router();

router.get("/", DoctorControllers.getAllDoctor);
router.get("/:id", DoctorControllers.getSingleDoctor);
router.patch(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidationSchemas.updateSchema),
  DoctorControllers.updateDoctor
);
router.delete(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorControllers.deleteDoctor
);
router.delete(
  "/remove/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DoctorControllers.softDeleteDoctor
);

export const DoctorRoutes = router;
