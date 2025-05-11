import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { MetaServices } from "./Meta.services";

const fetchDashboardMetaData = catchAsync(async (req, res) => {
  const result = await MetaServices.fetchDashboardMetaData(req.user!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});
export const MetaControllers = {
  fetchDashboardMetaData,
};
