import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";

export const GlobalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something Went Wrong!";
  let error = err;
  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
  } else if (err.code === "P2002") {
    message = "Unique Constraint Error";
    error = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
