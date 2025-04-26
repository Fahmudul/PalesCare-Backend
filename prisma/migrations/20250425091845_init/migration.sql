/*
  Warnings:

  - You are about to drop the column `patiendId` on the `PatientHealthData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `PatientHealthData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PatientHealthData" DROP CONSTRAINT "PatientHealthData_patiendId_fkey";

-- DropIndex
DROP INDEX "PatientHealthData_patiendId_key";

-- AlterTable
ALTER TABLE "PatientHealthData" DROP COLUMN "patiendId";

-- CreateIndex
CREATE UNIQUE INDEX "PatientHealthData_patientId_key" ON "PatientHealthData"("patientId");

-- AddForeignKey
ALTER TABLE "PatientHealthData" ADD CONSTRAINT "PatientHealthData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
