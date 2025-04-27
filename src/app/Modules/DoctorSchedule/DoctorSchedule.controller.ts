import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { pick } from "../../Utils/pick";
import { DoctorScheduleServices } from "./DoctorSchedule.Services";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleServices.createDoctorSchedule(
    req.user,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Schedules created successfullyy",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime", "isBooked"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortOrder"]);
  const result = await DoctorScheduleServices.getAllDoctorSchedulesFromDB(
    filters,
    options,
    req.user!
  );
  const { page, limit } = options;
  const meta = {
    page: Number(page) || 0,
    limit: Number(limit) || 10,
    total: result.length,
  };
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Schedule fetched successfullyy",
    meta,
    data: result,
  });
});

const deleteDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleServices.deleteDoctorSchedule(
    req.user,
    req.params.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Schedule deleted successfullyy",
    data: result,
  });
});

export const DoctorScheduleControllers = {
  createDoctorSchedule,
  getAllSchedules,
  deleteDoctorSchedule,
};
