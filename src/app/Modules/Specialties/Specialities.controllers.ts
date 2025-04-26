import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { SpecialityServices } from "./Specialities.services";
import { pick } from "../../Utils/pick";

import { JwtPayload } from "jsonwebtoken";

const createSpeciality = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await SpecialityServices.CreateSpecialityInDB(
    req.body,
    req.file!
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Speciality created successfully",
    data: result,
  });
});

const getAllSpecialities = catchAsync(async (req, res) => {
  const result = await SpecialityServices.getAllSpecialityFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialities fetched successfully",
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req, res) => {
  const result = await SpecialityServices.deleteSingleSpecialityFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Speciality deleted successfully",
    data: result,
  });
});

export const SpecialityControllers = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
