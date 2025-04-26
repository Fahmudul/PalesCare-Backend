import { fileUploader } from "../../Utils/fileUploader";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import { IFile } from "../../types/globals";
import { CustomError } from "../../Error/CustomError";
import { StatusCodes } from "http-status-codes";

// Create Admin
const CreateSpecialityInDB = async (payload: any, file: IFile) => {
  if (file) {
    const profilePhoto = await fileUploader.cloudinaryImageUploader(
      file.path,
      file.originalname
    );
    payload.icon = profilePhoto?.secure_url;
  }
  console.log("Speciality data", payload);
  const result = await prisma.specialities.create({
    data: payload,
  });
  if (!result) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Speciality not created");
  }
  return result;
};

const deleteSingleSpecialityFromDB = async (id: string) => {
  const result = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  if (!result) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Failed to delete");
  }
  return result;
};

const getAllSpecialityFromDB = async () => {
  const result = await prisma.specialities.findMany();
  if (!result) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Speciality not found");
  }
  return result;
};

export const SpecialityServices = {
  CreateSpecialityInDB,
  deleteSingleSpecialityFromDB,
  getAllSpecialityFromDB,
};
