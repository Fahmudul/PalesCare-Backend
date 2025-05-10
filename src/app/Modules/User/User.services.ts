import { fileUploader } from "./../../Utils/fileUploader";
import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
} from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import { IFile } from "../../types/globals";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";
import { userFilterableFields, userSearchAbleFields } from "./User.constants";
import { IUserFilterRequest } from "./User.interface";
import { JwtPayload } from "jsonwebtoken";
import { profile } from "console";

// Create Admin
const CreateAdminInDB = async (payload: any, file: IFile): Promise<Admin> => {
  // console.log("Service ", file);

  const userData = {
    email: payload.admin.email,
    password: bcrypt.hashSync(payload.password, 10),
    role: UserRole.ADMIN,
  };
  if (file) {
    const profilePhoto = await fileUploader.cloudinaryImageUploader(
      file.path,
      file.originalname
    );
    payload.admin.profilePhoto = profilePhoto?.secure_url;
    // console.log("Admin data", payload.admin);
  }
  // console.log(userData, "userData");

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({ data: userData });
    const createdAdmin = await transactionClient.admin.create({
      data: payload.admin,
    });
    return createdAdmin;
  });
  if (!result) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Admin not created");
  }
  return result;
};

// Create Doctor
const createDoctor = async (payload: any, file: IFile): Promise<Doctor> => {
  if (file) {
    const profilePhoto = await fileUploader.cloudinaryImageUploader(
      file.path,
      file.originalname
    );
    payload.doctor.profilePhoto = profilePhoto?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: payload.doctor,
    });

    return createdDoctorData;
  });

  if (!result) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Doctor not created");
  }

  return result;
};

// Create patient
const createPatient = async (payload: any, file: IFile): Promise<Patient> => {
  if (file) {
    const profilePhoto = await fileUploader.cloudinaryImageUploader(
      file.path,
      file.originalname
    );
    payload.patient.profilePhoto = profilePhoto?.secure_url;
  }
  console.log("payload", payload);
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.patient.create({
      data: payload.patient,
    });
    console.log("patient created");
    return createdDoctorData;
  });

  return result;
};

// Change profile status
const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!userData) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }
  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  if (!updateUserStatus) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Failed to update status");
  }

  return updateUserStatus;
};

const getAllUsersFromDB = async (filters: IUserFilterRequest, options: any) => {
  const { searchTerm, ...filterData } = filters;
  // console.log({ searchTerm, ...filterData }, "filters");
  const { page, limit, skip } = options;
  const andConditions: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as keyof typeof filterData],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  console.dir(whereCondition, { depth: "infinity" });
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.orderBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      Patient: true,
      Doctor: true,
    },
  });
  const total = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page: Number(page) || 0,
      limit: Number(limit) || 10,
      total,
    },
    data: result,
  };
};

const updateMyProfile = async (User: JwtPayload, payload: any, file: IFile) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: User.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExists) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }
  // console.log(User, "hitting admin case", UserRole.ADMIN, UserRole.SUPER_ADMIN);
  if (file) {
    const profilePhoto = await fileUploader.cloudinaryImageUploader(
      file.path,
      file.originalname
    );
    payload.profilePhoto = profilePhoto?.secure_url;
  }
  let profileInfo;
  if (User.role === UserRole.ADMIN || User.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: User.email,
      },
      data: {
        ...payload,
      },
    });
  } else if (User.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: User.email,
      },
      data: {
        ...payload,
      },
    });
  } else if (User.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: User.email,
      },
      data: {
        ...payload,
      },
    });
  }
  // console.log(result, "result from getMyProfile");
  console.log(profileInfo);
  return { ...profileInfo };
};
const getMyProfile = async (User: JwtPayload) => {
  let result: Admin | Doctor | Patient | null = null;
  // console.log(User, "from getMyProfile service");
  console.log(User, "hitting admin case", UserRole.ADMIN, UserRole.SUPER_ADMIN);

  if (User.role === UserRole.ADMIN || User.role === UserRole.SUPER_ADMIN) {
    result = await prisma.admin.findUnique({
      where: {
        email: User.email,
      },
    });
  } else if (User.role === UserRole.DOCTOR) {
    result = await prisma.doctor.findUnique({
      where: {
        email: User.email,
      },
    });
  } else if (User.role === UserRole.PATIENT) {
    result = await prisma.patient.findUnique({
      where: {
        email: User.email,
      },
    });
  }
  console.log(result, "result from getMyProfile");
  return result;
};
export const UserServices = {
  CreateAdminInDB,
  createDoctor,
  createPatient,
  changeProfileStatus,
  getAllUsersFromDB,
  getMyProfile,
  updateMyProfile,
};
