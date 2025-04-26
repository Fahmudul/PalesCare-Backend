-- DropForeignKey
ALTER TABLE "PatientHealthData" DROP CONSTRAINT "PatientHealthData_patientId_fkey";

-- AddForeignKey
ALTER TABLE "PatientHealthData" ADD CONSTRAINT "PatientHealthData_patiendId_fkey" FOREIGN KEY ("patiendId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
