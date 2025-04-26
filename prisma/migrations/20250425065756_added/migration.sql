/*
  Warnings:

  - A unique constraint covering the columns `[patiendId]` on the table `PatientHealthData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `PatientHealthData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientHealthData" ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PatientHealthData_patiendId_key" ON "PatientHealthData"("patiendId");

-- AddForeignKey
ALTER TABLE "PatientHealthData" ADD CONSTRAINT "PatientHealthData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
