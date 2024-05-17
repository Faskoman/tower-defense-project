import "dotenv/config";

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { getConnection, initConnection } from "./dbConnection";

const app = express();

app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get("/check", async (_, res) => {
  res.status(200);
  res.json({ status: "OK" });
});

app.get("/", async (_, res) => {
  try {
    const connection = getConnection();

    let sqlQuery = `
    SELECT crm.users.userName, crm.usershighscores.bestWave, crm.usershighscores.achievedAt
    FROM crm.users
    JOIN crm.usershighscores ON crm.users.id = crm.usershighscores.userId
    ORDER BY crm.usershighscores.bestWave DESC
    LIMIT 10;
      `;

    const [result] = await connection.query(sqlQuery, []);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "couldn't find users..." });
  }
});

async function init() {
  await initConnection();
  app.listen(3000, () => console.log("Server running on localhost:3000"));
}

init();
