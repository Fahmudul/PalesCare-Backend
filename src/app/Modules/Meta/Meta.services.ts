import { PaymentStatus, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../Shared/Prisma";

const fetchDashboardMetaData = async (user: JwtPayload) => {
  console.log("fetchDashboardMetaData");
  let metaData;
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user);

      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized Access");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  // Get All Doctor, Patient, Appointment count
  const doctorCount = await prisma.doctor.count({});
  const patientCount = await prisma.patient.count({});
  const adminCount = await prisma.admin.count({});
  const appointmentCount = await prisma.appointment.count({});
  const paymentCount = await prisma.payment.count({});

  // Total Revenue
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();
  return {
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
    adminCount,
    barChartData,
    pieChartData,
  };
};
const getAdminMetaData = async () => {
  // Get All Doctor, Patient, Appointment count
  const doctorCount = await prisma.doctor.count({});
  const patientCount = await prisma.patient.count({});
  const appointmentCount = await prisma.appointment.count({});
  const paymentCount = await prisma.payment.count({});

  // Total Revenue
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};
const getDoctorMetaData = async (user: JwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorScheduleCount = await prisma.doctorSchedules.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
    _sum: {
      amount: true,
    },
  });

  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedStatusData = appointmentStatusData.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));

  return {
    doctorScheduleCount,
    patientCount: patientCount.length,
    appointmentCount,
    totalRevenue,
    formattedStatusData,
    reviewCount,
  };
};
const getPatientMetaData = async (user: JwtPayload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });
  const formattedStatusData = appointmentStatusData.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedStatusData,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint } =
    await prisma.$queryRaw`
  SELECT DATE_TRUNC('month', "createdAt") AS month,
  CAST(COUNT(*) AS INTEGER) AS count
  FROM "Appointment"
  GROUP BY month
  ORDER BY month ASC
  `;
  console.log("appointmentCountByMonth", appointmentCountByMonth);
  return appointmentCountByMonth;
};

const getPieChartData = async () => {
  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
  const formattedStatusData = appointmentStatusData.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));

  return formattedStatusData;
};

export const MetaServices = {
  fetchDashboardMetaData,
};
