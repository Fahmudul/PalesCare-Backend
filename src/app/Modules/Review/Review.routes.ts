import express from "express";
import { UserRole } from "@prisma/client";
import { AuthGurd } from "../../Middlewares/AuthGurd";
import validateRequest from "../../Middlewares/validateRequest";
import { ReviewValidation } from "./Review.validation";
import { ReviewController } from "./Review.controllers";

const router = express.Router();

router.get("/", ReviewController.getAllFromDB);

router.post(
  "/",
  AuthGurd(UserRole.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB
);

export const ReviewRoutes = router;
