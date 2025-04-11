import express, { Application, Request, Response } from "express";
import cors from "cors";
import applicationRoutes from "./app/Routes";
import router from "./app/Routes";
import { GlobalErrorHandler } from "./app/Error/GlobalError";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(GlobalErrorHandler);
export default app;
