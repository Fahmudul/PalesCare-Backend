import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { PatientServices } from "./Patient.Services";
import { PATIENT_FILTERABLE_FIELDS } from "./Patient.constants";
import { pick } from "../../Utils/pick";

const getAllPatient = catchAsync(async (req, res) => {
  console.log("from controller", req.query);
  const filteredQuery = pick(req.query, [
    "searchTerm",
    ...PATIENT_FILTERABLE_FIELDS,
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log("filteredQuery", filteredQuery);
  const result = await PatientServices.getAllPatientFromDB(
    filteredQuery,
    options
  );
  const meta = {
    page: Number(options.page) || 0,
    limit: Number(options.limit) || 10,
    total: result.length,
  };
  console.log({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Patients retrieved successfully",
    meta,
    data: result,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin retrieved successfully",
    meta,
    data: result,
  });
});

const getSinglePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.getSinglePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrieved successfully",
    data: result,
  });
});
const updatePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.updateSinglePatientFromDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient information updated successfully",
    data: result,
  });
});
const deletePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.deleteSinglePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});
const softDeletePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.softDeletePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfullyy",
    data: result,
  });
});

export const PatientController = {
  getAllPatient,
  getSinglePatient,
  updatePatient,
  deletePatient,
  softDeletePatient,
};
