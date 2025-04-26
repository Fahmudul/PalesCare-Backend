import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { UserServices } from "./User.services";
import { pick } from "../../Utils/pick";
import { userFilterableFields, userSearchAbleFields } from "./User.constants";
import { JwtPayload } from "jsonwebtoken";

const createAdmin = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await UserServices.CreateAdminInDB(req.body, req.file!);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserServices.createDoctor(req.body, req.file!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Created successfuly!",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserServices.createPatient(req.body, req.file!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient Created successfuly!",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});
const getMyProfile = catchAsync(async (req, res) => {
  // const { id } = req.params;

  const result = await UserServices.getMyProfile(req.user as JwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users profile fetched!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  // console.log(req.query, "from controller");
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  // console.log("filters", filters);
  // console.log("options", options);
  const result = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  // const { id } = req.params;

  const result = await UserServices.updateMyProfile(
    req.user as JwtPayload,
    req.body,
    req?.file!
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile updated!",
    data: result,
  });
});
export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  changeProfileStatus,
  getAllUsers,
  getMyProfile,
  updateMyProfile,
};
