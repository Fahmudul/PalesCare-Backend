-- AlterTable
ALTER TABLE "PatientHealthData" ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "maritalStatus" SET DEFAULT 'UNMARRIED';
