import { NextFunction, Request, Response, Router } from "express";
import { SpecialityControllers } from "./Specialities.controllers";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../Utils/fileUploader";
import { SpecialtiesValidtaion } from "./Specialities.validation";

const router = Router();

// Get Me Profile Route

router.get("/", SpecialityControllers.getAllSpecialities);

router.post(
  "/create-speciality",
  // AuthGurd(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const result = SpecialtiesValidtaion.createSpecialitySchema.parse(
      JSON.parse(req.body.data)
    );
    req.body = result;
    SpecialityControllers.createSpeciality(req, res, next);
  }
);

router.delete(
  "/:id",
  AuthGurd(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialityControllers.deleteSpeciality
);

export const SpecialityRoutes = router;
