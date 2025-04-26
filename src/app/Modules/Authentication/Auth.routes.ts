import express from "express";

import { AuthControllers } from "./Auth.controllers";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.post("/login", AuthControllers.loginUser);
router.get("/refresh-token", AuthControllers.getAccessToken);
router.post(
  "/change-password",
  AuthGurd(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.SUPER_ADMIN
  ),
  AuthControllers.changePasssword
);
router.post(
  "/forgot-password",

  AuthControllers.forgotPasssword
);
router.post(
  "/reset-password",

  AuthControllers.resetPassword
);
export const AuthRoutes = router;
