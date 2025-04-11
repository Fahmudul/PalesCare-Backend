import { Router } from "express";
import { UserRoutes } from "../Modules/User/User.routes";
import { AdminRoutes } from "../Modules/Admin/Admin.routes";

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
];

applicationRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
