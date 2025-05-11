import bcrypt from "bcryptjs";
import { prisma } from "../src/app/Shared/Prisma";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminAlreadyExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (isSuperAdminAlreadyExists) {
      console.log("Super admin already exists");
      return;
    }

    return await prisma.user.create({
      data: {
        email: "superadmin@localhost",
        password: bcrypt.hashSync("superadmin!", 10),
        role: "SUPER_ADMIN",
        admin: {
          create: {
            name: "Super Admin",
            // email: "superadmin@localhost",
            contactNumber: "1234567890",
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};

seedSuperAdmin();
