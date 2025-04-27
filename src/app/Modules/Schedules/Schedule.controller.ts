import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { pick } from "../../Utils/pick";
import { ScheduleServices } from "./Schedule.Services";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleServices.createSchedule(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule created successfullyy",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortOrder"]);
  const result = await ScheduleServices.getAllSchedulesFromDB(
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
    message: "Schedule fetched successfullyy",
    meta,
    data: result,
  });
});

export const ScheduleController = { createSchedule, getAllSchedules };
