import { Server } from "http";
import app from "./app";
import Config from "./app/Config";
async function connectDb() {
  const server: Server = app.listen(Config.port, () => {
    console.log(`Server is running on ${Config.port}`);
  });

  const closeServer = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
      process.exit(1);
    }
  };
  process.on("uncaughtException", (err) => {
    closeServer();
  });
  process.on("unhandledRejection", (err) => {
    closeServer();
  });
}

connectDb();
