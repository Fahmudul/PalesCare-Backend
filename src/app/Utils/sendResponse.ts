import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  success: boolean;
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, message, data: responseData, success, meta } = data;
  res.status(statusCode).json({
    success,
    message,
    meta,
    data: responseData,
  });
};
