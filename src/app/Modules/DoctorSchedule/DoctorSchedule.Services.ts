import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../Shared/Prisma";
import { Prisma } from "@prisma/client";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import { IPaginationOptions } from "../../Interfaces/pagination";
import { paginationHelper } from "../../Utils/calculatePagination";
const createDoctorSchedule = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getAllDoctorSchedulesFromDB = async (
  query: any,
  options: any,
  user: JwtPayload
) => {
  // console.log("Service ", query);
  const { searchTerm, ...filterData } = query;
  console.log("Service ", filterData);
  const { startDateTime, endDateTime, isBooked } = filterData;
  const orConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDateTime && endDateTime) {
    orConditions.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDateTime,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDateTime,
            },
          },
        },
      ],
    });
  }

  if (isBooked) {
    console.log("halloe");
    orConditions.push({
      isBooked: {
        equals:
          typeof isBooked === "string" && isBooked === "true" ? true : false,
      },
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput =
    orConditions.length > 0 ? { AND: orConditions } : {};

  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip: Number(options.page) || 0,
    take: Number(options.limit) || 11,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });
  return result;
};

const deleteDoctorSchedule = async (scheduleId: string, user: JwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "This schedule is already booked"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

const getMySchedulesFromDB = async (
  filters: any,
  options: IPaginationOptions,
  user: JwtPayload
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDateTime, endDateTime, ...filterData } = filters;
  const isDoctorExists = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!isDoctorExists) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Doctor not found with this email"
    );
  }
  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];
  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDateTime,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDateTime,
            },
          },
        },
      ],
    });
  }

  if (filterData.isBooked) {
    andConditions.push({
      isBooked:
        typeof filterData.isBooked === "string" &&
        filterData.isBooked === "true"
          ? true
          : false,
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: isDoctorExists.id,
      ...whereCondition,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });
  // console.log(result, "result");
  return result;
};

export const DoctorScheduleServices = {
  createDoctorSchedule,
  getAllDoctorSchedulesFromDB,
  deleteDoctorSchedule,
  getMySchedulesFromDB,
};
