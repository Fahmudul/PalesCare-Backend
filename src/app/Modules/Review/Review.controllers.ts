import { Request, Response } from "express";
import { ReviewServices } from "./Review.services";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { pick } from "../../Utils/pick";

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ReviewServices.insertIntoDB(req.user!, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["patientEmail", "doctorEmail"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewServices.getAllReviewFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
