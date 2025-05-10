import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./User.controllers";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";
import multer from "multer";
import path from "path";
import { fileUploader } from "../../Utils/fileUploader";
import { v2 as cloudinary } from "cloudinary";
import Config from "../../Config";
import validateRequest from "../../Middlewares/validateRequest";
import { UserValidations } from "./User.validation";

const router = Router();

// Get Me Profile Route
router.get(
  "/me",
  AuthGurd(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  UserController.getMyProfile
);
router.get(
  "/",
  // AuthGurd(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUsers
);

router.post(
  "/create-admin",
  AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const result = UserValidations.createAdminSchema.parse(
      JSON.parse(req.body.data)
    );
    req.body = result;
    UserController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  AuthGurd(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createDoctor.parse(JSON.parse(req.body.data));
    return UserController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createPatient.parse(JSON.parse(req.body.data));
    return UserController.createPatient(req, res, next);
  }
);
router.patch(
  "/update-my-profile",
  AuthGurd(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  }
);

router.patch(
  "/:id/status",
  AuthGurd(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.updateStatus),
  UserController.changeProfileStatus
);

export const UserRoutes = router;
