import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../Shared/Prisma";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { IPaginationOptions } from "../../Interfaces/pagination";
import { paginationHelper } from "../../Utils/calculatePagination";

const createPrescriptionInDB = async (payload: any, user: JwtPayload) => {
  console.log("generated");
  const isAppointmentExists = await prisma.appointment.findUnique({
    where: {
      id: payload.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });
  console.log(isAppointmentExists, "isAppointmentExists");
  if (!isAppointmentExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Appointment not found");
  }

  if (!(user?.email === isAppointmentExists.doctor.email)) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized Access");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: payload.appointmentId,
      doctorId: isAppointmentExists.doctorId,
      patientId: isAppointmentExists.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

const getAllFromDB = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];
  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    include: {
      patient: true,
      doctor: true,
    },
    skip,
    take: limit,
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
export const PrescriptionServices = {
  createPrescriptionInDB,
  getAllFromDB,
};
