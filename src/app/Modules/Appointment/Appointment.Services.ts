import {
  AppointmentStatus,
  MedicalReport,
  PaymentStatus,
  UserRole,
} from ".prisma/client";
import { Patient, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { PATIENT_SEARCHABLE_FIELDS } from "./Appointment.constants";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../Error/CustomError";
import { IPatientFilterRequest, IPatientUpdate } from "./Appointment.interface";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { paginationHelper } from "../../Utils/calculatePagination";
const prisma = new PrismaClient();
const createAppointmentInDB = async (user: JwtPayload, payload: any) => {
  console.log("Creating appointment in DB", user, payload);
  const patientInfo = await prisma.patient.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!patientInfo) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Patient not found");
  }

  const isDoctorExists = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
    },
  });

  if (!isDoctorExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  const isScheduleAlreadyBooked = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuid();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    // change is booked status and set appintmentt id in the doctor Schedule table
    const result = await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    const payment = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: isDoctorExists.appointmentFee,
        transactionId: uuid(),
        status: PaymentStatus.UNPAID,
      },
    });
    return { appointmentData, result, payment };
  });

  return result;
};

const getMyAppointment = async (
  user: JwtPayload,
  filter: any,
  options: any
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = filter;
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key as keyof typeof filterData],
      },
    }));
  }
  if (user.role == UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }
  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
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
    include:
      user.role == UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: {
                MedicalReport: true,
                PatientHealthData: true,
              },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({ where: whereConditions });
  return { meta: { total, page, limit }, data: result };
};

const changeAppointmentStatusInDB = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: JwtPayload
) => {
  console.log("changeAppointmentStatusInDB", appointmentId, status);
  const appointmentData = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });
  console.log(appointmentData, "appointmentData");
  if (!appointmentData) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Appointment not found");
  }
  // Check if the doctor is not trying to change some one else's status
  if (user.role === UserRole.DOCTOR) {
    if (appointmentData.doctor.email !== user.email) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized Access");
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });
  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinTimeStamp = new Date(Date.now() - 2 * 60 * 1000);
  // Find all the unpaid appointments that are older than 30 minutes
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinTimeStamp,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });
  // console.log(unpaidAppointments, "thirtyMinTimeStamp");
  const appointmentIDsToCancel = unpaidAppointments.map(
    (appointment) => appointment.id
  );
  // console.log(appointmentIDsToCancel, "appointmentIDsToCancel");

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIDsToCancel,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIDsToCancel,
        },
      },
    }); 

    for (const unpaidAppointment of unpaidAppointments) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unpaidAppointment.doctorId,
          scheduleId: unpaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    } 
    console.log("updated")
  });
};
export const AppointmentServices = {
  createAppointmentInDB,
  changeAppointmentStatusInDB,
  getMyAppointment,
  cancelUnpaidAppointments,
};
