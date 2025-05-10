import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { AppointmentServices } from "./Appointment.Services";
import { PATIENT_FILTERABLE_FIELDS } from "./Appointment.constants";
import { pick } from "../../Utils/pick";

const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentServices.createAppointmentInDB(
    req.user!,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Appointment created successfully",
    data: result,
  });
});
const changeAppointmentStatus = catchAsync(async (req, res) => {
  const result = await AppointmentServices.changeAppointmentStatusInDB(
    req.params.id,
    req.body.status,
    req.user!
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Appointment status changed successfully",
    data: result,
  });
});
const getMyAppointment = catchAsync(async (req, res) => {
  const user = req?.user;
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentServices.getMyAppointment(
    user!,
    filters,
    options
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Appointment created successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
};
