import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { PrescriptionServices } from "./Prescription.services";

const createPrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.createPrescriptionInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Prescription created successfully",
    data: result,
  });
});
export const PrescriptionControllers = { createPrescription };
