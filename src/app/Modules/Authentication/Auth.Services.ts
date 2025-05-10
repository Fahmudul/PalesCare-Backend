import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../Error/CustomError";
import { prisma } from "../../Shared/Prisma";
import bcrypt from "bcryptjs";

import Config from "../../Config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import { generateJWTToken, verifyToken } from "../../Utils/jwtHelpers";
import { sendMail } from "../../Utils/sendEmail";
const loginUser = async (payload: { email: string; password: string }) => {
  console.log({ payload });
  const { email, password } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Compare is user password matched with hashed password
  const isPasswordMatched = bcrypt.compareSync(password, isUserExists.password);
  console.log(isPasswordMatched, "isPasswordMatched");
  if (!isPasswordMatched) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
  }
  const tokenPayload = {
    email: isUserExists.email,
    role: isUserExists.role,
  };
  console.log(tokenPayload, "tokenPayload");
  const accessToken = generateJWTToken(
    tokenPayload,
    Config.access_token_secret!,
    Config.access_token_expires_in!
  );
  const refreshToken = generateJWTToken(
    tokenPayload,
    Config.refresh_token_secret!,
    Config.refresh_token_expires_in!
  );

  // console.log({ accessToken, refreshToken });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

const getAccessToken = async (token: string) => {
  // console.log("refresh token");
  const decodedData = jwt.verify(token, Config.refresh_token_secret!) as any;
  if (!decodedData) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized Access");
  }
  console.log("decoded data", decodedData);
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  const accessToken = generateJWTToken(
    {
      email: isUserExists.email,
      role: isUserExists.role,
    },
    Config.access_token_secret!,
    Config.access_token_expires_in!
  );
  return {
    accessToken,
  };
};

const changePassword = async (
  currentUser: JwtPayload,
  payload: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }
) => {
  const { email, oldPassword, newPassword } = payload;
  // Check if the user is trying to change someone else's password
  if (currentUser.email !== email) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized Access");
  }
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  // Compare is current password matched with current hashed password
  const isPasswordMatched = bcrypt.compareSync(
    oldPassword,
    isUserExists.password
  );
  if (!isPasswordMatched) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedNewPassword,
      needPasswordChange: false,
    },
  });
  if (!updatedUser) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update password"
    );
  }
  return {};
};
const forgotPasssword = async (
  // currentUser: JwtPayload,
  payload: {
    email: string;

    newPassword: string;
  }
) => {
  const { email, newPassword } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  const resetPasswordToken = generateJWTToken(
    {
      email: isUserExists.email,
      role: isUserExists.role,
    },
    Config.password_reset_token!,
    Config.password_reset_token_expires_in!
  );
  // console.log(resetPasswordToken, "resetPasswordToken");
  const resetPassLink = `${Config.reset_password_link}?id=${isUserExists.id}&token=${resetPasswordToken}`;
  console.log(resetPassLink, "resetPassLink");
  await sendMail({
    email: isUserExists.email,
    subject: "Reset Password",
    link: resetPassLink,
  });
  return {};
};

const resetPassword = async (payload: {
  id: string;
  newPassword: string;
  token: string;
}) => {
  const { id, newPassword, token } = payload;
  // console.log(payload);
  if (!token || !id || !newPassword) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "All fields are required");
  }
  // Check is token is valid or not
  const verifiedToken = verifyToken(
    token,
    Config.password_reset_token!
  ) as JwtPayload;
  if (!verifiedToken) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired password reset token"
    );
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      id,
      email: verifiedToken.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }
  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedNewPassword,
    },
  });
  if (!updatedUser) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to reset password"
    );
  }
  return {
    redirectUrl: "https://palescare.com",
  };
};
export const AuthServices = {
  loginUser,
  getAccessToken,
  changePassword,
  forgotPasssword,
  resetPassword,
};
