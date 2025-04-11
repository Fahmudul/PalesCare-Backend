import { Server } from "http";
import app from "./app";
import Config from "./app/Config";

async function connectDb() {
  const server: Server = app.listen(Config.port, () => {
    console.log(`Server is running on ${Config.port}`);
  });
}

connectDb();
