import { PrismaClient, UserRole } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
const CreateAdminInDB = async (payload: any) => {
  console.log("Service ", payload);
  const userData = {
    email: payload.admin.email,
    password: bcrypt.hashSync(payload.password, 10),
    role: UserRole.ADMIN,
  };
  // console.log(userData, "userData");

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({ data: userData });
    const createdAdmin = await transactionClient.admin.create({
      data: payload.admin,
    });
    return createdAdmin;
  });

  // Logic to create admin in the database
  // This is a placeholder function. You would implement the actual logic here.
  return result;
};

export const UserServices = {
  CreateAdminInDB,
};
