import { Router } from "express";
import { UserRoutes } from "../Modules/User/User.routes";
import { AdminRoutes } from "../Modules/Admin/Admin.routes";
import { AuthRoutes } from "../Modules/Authentication/Auth.routes";
import { SpecialityRoutes } from "../Modules/Specialties/Specialities.routes";
import { DoctorRoutes } from "../Modules/Doctor/Doctor.routes";
import { PatientRoutes } from "../Modules/Patient/Patient.routes";

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
];

applicationRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
