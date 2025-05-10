import {
  BLOOD_GROUP,
  Gender,
  MARITAL_STATUS,
  MedicalReport,
} from "@prisma/client";

export type IPatientFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
};

type IPatientHealthData = {
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BLOOD_GROUP;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MARITAL_STATUS;
};

type IMedicalReport = {
  reportName: string;
  reportLink: string;
};

export type IPatientUpdate = {
  name: string;
  contactNumber: string;
  address: string;
  PatientHealthData?: IPatientHealthData;
  MedicalReport?: IMedicalReport[] | MedicalReport | null;
};
