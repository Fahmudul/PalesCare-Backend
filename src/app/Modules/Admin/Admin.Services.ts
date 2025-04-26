import { Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { ADMIN_SEARCHABLE_FIELDS } from "./Admin.constants";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../Error/CustomError";
import { IAdminFilterRequest } from "./Admin.interface";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: IAdminFilterRequest, options: any) => {
  // console.log("Service ", query);
  const { searchTerm, ...filterData } = query;
  console.log("Service ", options);
  const orConditions: Prisma.AdminWhereInput[] = [];
  if (query.searchTerm) {
    orConditions.push({
      OR: ADMIN_SEARCHABLE_FIELDS.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    orConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as keyof typeof filterData],
        },
      })),
    });
  }
  orConditions.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.AdminWhereInput = { AND: orConditions };
  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: Number(options.page) || 0,
    take: Number(options.limit) || 10,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateSingleAdminFromDB = async (
  id: string,
  data: Prisma.AdminUpdateInput
) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Admin not found");
  }
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: { ...data },
  });

  return result;
};

const deleteSingleAdminFromDB = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Admin not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });

  return result;
};

const softDeleteAdminFromDB = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Admin not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedAdmin;
  });

  return result;
};


export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateSingleAdminFromDB,
  deleteSingleAdminFromDB,
  softDeleteAdminFromDB,
};
