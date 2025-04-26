import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { DoctorServices } from "./Doctor.Services";
import { DOCTOR_FILTERABLE_FIELDS } from "./Doctor.constants";
import { pick } from "../../Utils/pick";

const getAllDoctor = catchAsync(async (req, res) => {
  console.log("from controller", req.query);
  const filteredQuery = pick(req.query, [
    "searchTerm",
    ...DOCTOR_FILTERABLE_FIELDS,
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log("filteredQuery", filteredQuery);
  const result = await DoctorServices.getAllDoctorFromDB(
    filteredQuery,
    options
  );
  const meta = {
    page: Number(options.page) || 0,
    limit: Number(options.limit) || 10,
    total: result.length,
  };
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Doctor retrieved successfully",
    meta,
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.getSingleDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});
const updateDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.updateSingleDoctorFromDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor information updated successfully",
    data: result,
  });
});
const deleteDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.deleteSingleDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});
const softDeleteDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.softDeleteDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor deleted successfullyy",
    data: result,
  });
});

export const DoctorControllers = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  softDeleteDoctor,
};
