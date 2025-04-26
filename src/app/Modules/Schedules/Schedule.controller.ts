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

export const ScheduleController = { createSchedule };


