import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { PaymentServices } from "./Payment.services";

const initPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.initPaymentInDB(
    req.params.appointmentId
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment initiated successfullyy",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.validatePaymentInDb(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});

export const PaymentControllers = {
  initPayment,
  validatePayment,
};
