import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../Shared/Prisma";
const createSchedule = async (schedule: any) => {
  // console.log(schedule);
  const scheduleResult = [];
  const { startDate, endDate, startTime, endTime } = schedule;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );
    // console.log("currentDate", startDate);
    const endDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, 30),
      };

      const result = await prisma.schedule.create({
        data: scheduleData,
      });

      scheduleResult.push(result);
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }

    currentDate.setDate(currentDate.getDate() + 1);

    // console.log("lastDate", endDate);
    return scheduleResult;
  }
};

export const ScheduleServices = {
  createSchedule,
};
