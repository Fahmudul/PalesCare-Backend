import { Router } from "express";
import { UserRoutes } from "../Modules/User/User.routes";
import { AdminRoutes } from "../Modules/Admin/Admin.routes";
import { AuthRoutes } from "../Modules/Authentication/Auth.routes";
import { SpecialityRoutes } from "../Modules/Specialties/Specialities.routes";
import { DoctorRoutes } from "../Modules/Doctor/Doctor.routes";
import { PatientRoutes } from "../Modules/Patient/Patient.routes";
import { ScheduleRoutes } from "../Modules/Schedules/Schedule.routes";
import { DoctorScheduleRoutes } from "../Modules/DoctorSchedule/DoctorSchedule.routes";
import { AppointmentRoutes } from "../Modules/Appointment/Appointment.routes";
import { PaymentRoutes } from "../Modules/Payment/Payment.routes";
import { PrescriptionRoutes } from "../Modules/Prescription/Prescription.routes";

const router = Router();

const applicationRoutes = [
  {
    path: "/user",
    routes: UserRoutes,
  },
  {
    path: "/admin",
    routes: AdminRoutes,
  },
  {
    path: "/auth",
    routes: AuthRoutes,
  },
  {
    path: "/speciality",
    routes: SpecialityRoutes,
  },
  {
    path: "/doctor",
    routes: DoctorRoutes,
  },
  {
    path: "/patient",
    routes: PatientRoutes,
  },
  {
    path: "/schedule",
    routes: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    routes: DoctorScheduleRoutes,
  },
  {
    path: "/appointment",
    routes: AppointmentRoutes,
  },
  {
    path: "/payment",
    routes: PaymentRoutes,
  },
  {
    path: "/prescription",
    routes: PrescriptionRoutes,
  },
];

applicationRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
