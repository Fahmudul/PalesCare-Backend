import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { pick } from "../../Utils/pick";

const softDeletePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.softDeletePatientFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfullyy",
    data: result,
  });
});

export const ScheduleController = {
 
};
