import "dotenv/config";

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { initConnection } from "./dbConnection";
import { router as usersRouter } from "./Users.router"

const app = express();

app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);

async function init() {
  await initConnection();
  app.listen(3000, () => console.log("Server running on localhost:3000"));
}

init();
