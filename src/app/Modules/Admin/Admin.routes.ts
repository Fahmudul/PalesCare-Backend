import { Router } from "express";
import { AdminController } from "./Admin.controller";
import validateRequest from "../../Middlewares/validateRequest";
import { AdminValidationSchemas } from "./Admin.validations";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router.get(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getSingleAdmin
);
router.patch(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(AdminValidationSchemas.updateSchema),
  AdminController.updateAdmin
);
router.delete(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin
);
router.delete(
  "/remove/:id",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteAdmin
);

export const AdminRoutes = router;
