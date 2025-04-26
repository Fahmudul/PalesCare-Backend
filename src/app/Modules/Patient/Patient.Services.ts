import { MedicalReport } from "./../../../../node_modules/.prisma/client/index.d";
import { Patient, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { PATIENT_SEARCHABLE_FIELDS } from "./Patient.constants";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../Error/CustomError";
import { IPatientFilterRequest, IPatientUpdate } from "./Patient.interface";

const prisma = new PrismaClient();

const getAllPatientFromDB = async (
  query: IPatientFilterRequest,
  options: any
) => {
  // console.log("Service ", query);
  const { searchTerm, ...filterData } = query;
  console.log("Service ", options);
  const orConditions: Prisma.PatientWhereInput[] = [];
  if (query.searchTerm) {
    orConditions.push({
      OR: PATIENT_SEARCHABLE_FIELDS.map((field) => ({
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
  const whereCondition: Prisma.PatientWhereInput =
    orConditions.length > 0 ? { AND: orConditions } : {};
  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.patient.findMany({
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
    include: {
      MedicalReport: true,
      PatientHealthData: true,
    },
  });
  return result;
};

const getSinglePatientFromDB = async (id: string): Promise<Patient> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      MedicalReport: true,
      PatientHealthData: true,
    },
  });
  return result;
};

const updateSinglePatientFromDB = async (
  id: string,
  data: Partial<IPatientUpdate>
) => {
  const { PatientHealthData, MedicalReport, ...patientData } = data;
  console.log("Patient Data", id);
  const isExists = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Patient not found");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const updatePatientData = await transactionClient.patient.update({
      where: {
        id: isExists.id,
      },
      data: {
        ...patientData,
      },
      include: {
        PatientHealthData: true,
        MedicalReport: true,
      },
    });
    if (PatientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: isExists.id,
        },
        update: PatientHealthData,
        create: {
          patientId: isExists.id,
          ...PatientHealthData,
        },
      });
    }

    if (
      MedicalReport &&
      Array.isArray(MedicalReport) &&
      MedicalReport.length > 0
    ) {
      for (const report of MedicalReport) {
        await transactionClient.medicalReport.create({
          data: {
            ...report,
            patientId: isExists.id,
          },
        });
      }
    }

    return updatePatientData;
  });
  const updatedPatient = await prisma.patient.findUnique({
    where: {
      id: isExists.id,
    },
    include: {
      MedicalReport: true,
      PatientHealthData: true,
    },
  });
  console.log(updatedPatient, "Updated Patient");
  return updatedPatient;
};

const deleteSinglePatientFromDB = async (id: string) => {
  const isExists = await prisma.patient.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Patient not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletePatientHealthData =
      await transactionClient.patientHealthData.delete({
        where: {
          patientId: id,
        },
      });

    const deleteMedicalReport =
      await transactionClient.medicalReport.deleteMany({
        where: {
          patientId: id,
        },
      });

    const deletedPatient = await transactionClient.patient.delete({
      where: { id },
    });

    const result = await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });
    return result;
  });

  return result;
};

const softDeletePatientFromDB = async (id: string) => {
  const isExists = await prisma.patient.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Patient not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedPatient;
  });

  return result;
};

export const PatientServices = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updateSinglePatientFromDB,
  deleteSinglePatientFromDB,
  softDeletePatientFromDB,
};
