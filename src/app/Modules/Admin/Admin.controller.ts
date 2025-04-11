import { StatusCodes } from "http-status-codes";
import catchAsync from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { AdminServices } from "./Admin.Services";
import { ADMIN_SEARCHABLE_FIELDS } from "./Admin.constants";
import { pick } from "../../Utils/pick";

const getAllAdmins = catchAsync(async (req, res) => {
  console.log("from controller", req.query);
  const filteredQuery = pick(req.query, [
    "searchTerm",
    ...ADMIN_SEARCHABLE_FIELDS,
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log("filteredQuery", options);
  const result = await AdminServices.getAllAdminFromDB(filteredQuery, options);
  const meta = {
    page: Number(options.page) || 0,
    limit: Number(options.limit) || 10,
    total: result.length,
  };
  console.log({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin retrieved successfully",
    meta,
    data: result,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin retrieved successfully",
    meta,
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getSingleAdminFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.updateSingleAdminFromDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin information updated successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.deleteSingleAdminFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
