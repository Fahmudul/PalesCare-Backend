import { JwtPayload } from "jsonwebtoken";
import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../Shared/Prisma";
import { Prisma } from "@prisma/client";
const createSchedule = async (schedule: any) => {
  // console.log(schedule);
  const scheduleResult = [];
  const { startDate, endDate, startTime, endTime } = schedule;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    // console.log("currentDate", startDate);
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, 30),
      };
      const ifScheduleExists = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
        },
      });
      if (!ifScheduleExists) {
        console.log("scheduleData", scheduleData);
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        scheduleResult.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }

    currentDate.setDate(currentDate.getDate() + 1);

    // console.log("lastDate", endDate);
    return scheduleResult;
  }
};

const getAllSchedulesFromDB = async (
  query: any,
  options: any,
  user: JwtPayload
) => {
  // console.log("Service ", query);
  const { searchTerm, ...filterData } = query;
  console.log("Service ", filterData);
  const { startDateTime, endDateTime } = filterData;
  const orConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    orConditions.push({
      AND: [
        {
          startDate: {
            gte: startDateTime,
          },
        },
        {
          endDate: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  const whereCondition: Prisma.ScheduleWhereInput =
    orConditions.length > 0 ? { AND: orConditions } : {};

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });
  const doctorSchedulesIDs = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );
  console.log(doctorSchedulesIDs);
  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.schedule.findMany({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorSchedulesIDs,
      },
    },
    skip: Number(options.page) || 0,
    take: Number(options.limit) || 11,
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

export const ScheduleServices = {
  createSchedule,
  getAllSchedulesFromDB,
};
