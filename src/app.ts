import express, { Application, Request, Response } from "express";
import cors from "cors";
import applicationRoutes from "./app/Routes";
import router from "./app/Routes";
import { GlobalErrorHandler } from "./app/Error/GlobalError";
import { sendResponse } from "./app/Utils/sendResponse";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

app.use((req: Request, res: Response, next: Function) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Api Not Found",
  });
});
export default app;
