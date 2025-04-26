import { Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { DOCTOR_SEARCHABLE_FIELDS } from "./Doctor.constants";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../Error/CustomError";
import { IDoctorFilterRequest, IDoctorUpdate } from "./Doctor.interface";

const prisma = new PrismaClient();

const getAllDoctorFromDB = async (
  query: IDoctorFilterRequest,
  options: any
) => {
  // console.log("Service ", query);
  const { searchTerm, specialties, ...filterData } = query;
  console.log("Service ", options);
  const orConditions: Prisma.DoctorWhereInput[] = [];
  if (query.searchTerm) {
    orConditions.push({
      OR: DOCTOR_SEARCHABLE_FIELDS.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialties && specialties.length > 0) {
    orConditions.push({
      DoctorSpecialities: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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
  const whereCondition: Prisma.DoctorWhereInput = { AND: orConditions };
  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.doctor.findMany({
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
      DoctorSpecialities: true,
    },
  });
  return result;
};

const getSingleDoctorFromDB = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      DoctorSpecialities: true,
    },
  });
  return result;
};

const updateSingleDoctorFromDB = async (id: string, data: IDoctorUpdate) => {
  const { specialties, ...doctorInfo } = data;
  console.log(specialties);
  const isDoctorExists = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isDoctorExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  const updateSuccess = await prisma.$transaction(async (transactionClient) => {
    let success = true;
    // Update doctor info data
    const updatedDoctor = await transactionClient.doctor.update({
      where: {
        id: isDoctorExists.id,
      },
      data: doctorInfo,
    });
    if (!updatedDoctor) {
      success = false;
    }
    // Delete or Add doctors specialities
    const deleteSpecialties = specialties.filter(
      (specialty) => specialty.isDeleted
    );

    if (deleteSpecialties.length > 0) {
      for (const specialty of deleteSpecialties) {
        const result = await transactionClient.doctorSpecialities.deleteMany({
          where: {
            doctorId: isDoctorExists.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
        if (result.count === 0) {
          success = false;
        }
      }
    }

    const addSpecialties = specialties.filter(
      (specialty) => !specialty.isDeleted
    );
    if (addSpecialties.length > 0) {
      for (const specialty of addSpecialties) {
        const result = await transactionClient.doctorSpecialities.create({
          data: {
            doctorId: isDoctorExists.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
        if (!result) {
          success = false;
        }
      }
    }

    return success;
  });

  if (!updateSuccess) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update doctor information"
    );
  }

  // Find updated Doctor
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      DoctorSpecialities: true,
    },
  });
  return result;
};

const deleteSingleDoctorFromDB = async (id: string) => {
  const isExists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletedDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedDoctor.email,
      },
    });
    return deletedDoctor;
  });

  return result;
};

const softDeleteDoctorFromDB = async (id: string) => {
  const isExists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Doctor not found");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const deletedDoctor = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedDoctor;
  });

  return result;
};

export const DoctorServices = {
  getAllDoctorFromDB,
  getSingleDoctorFromDB,
  updateSingleDoctorFromDB,
  deleteSingleDoctorFromDB,
  softDeleteDoctorFromDB,
};
