import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { AuthServices } from "./Auth.Services";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    success: true,
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const getAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);
  const result = await AuthServices.getAccessToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    success: true,
    data: result,
  });
});
const changePasssword = catchAsync(async (req, res) => {
  console.log(req.body, req.user);
  const result = await AuthServices.changePassword(req.user!, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
    success: true,
    data: result,
  });
});
const forgotPasssword = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await AuthServices.forgotPasssword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
    success: true,
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  // console.log(req.body);
  const token = req.headers.authorization;
  // console.log(token, "token from cookie");
  const result = await AuthServices.resetPassword({ ...req.body, token });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Password reset successfully",
    success: true,
    data: result,
  });
});

export const AuthControllers = {
  forgotPasssword,
  loginUser,
  getAccessToken,
  changePasssword,
  resetPassword,
};
