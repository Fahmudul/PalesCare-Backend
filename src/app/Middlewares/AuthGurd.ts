import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../Utils/jwtHelpers";
import Config from "../Config";
import { CustomError } from "../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

export const AuthGurd = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
      }
      const verifiedToken = verifyToken(
        token as string,
        Config.access_token_secret!
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
      }
      // Check if the user has the required role
      if (roles.length > 0 && !roles.includes(verifiedToken.role)) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }
      // Attach the verified token to the request object for further use
      req.user = verifiedToken; // Assuming you want to attach the user info to the request object
      // console.log(verifiedToken);
      next();
    } catch (error) {
      next(error);
    }
  };
};
