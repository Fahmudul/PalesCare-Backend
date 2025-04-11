-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_email_fkey";

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
