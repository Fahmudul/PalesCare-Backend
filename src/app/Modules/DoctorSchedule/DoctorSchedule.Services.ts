import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../Shared/Prisma";
import { Prisma } from "@prisma/client";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";
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

export const DoctorScheduleServices = {
  createDoctorSchedule,
  getAllDoctorSchedulesFromDB,
  deleteDoctorSchedule,
};
