import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { UserServices } from "./User.services";

const createAdmin = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await UserServices.CreateAdminInDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
};
