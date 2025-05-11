import { Router } from "express";
import { MetaControllers } from "./Meta.controller";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  AuthGurd(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATIENT,
    UserRole.DOCTOR
  ),
  MetaControllers.fetchDashboardMetaData
);

export const MetaRoutes = router;
