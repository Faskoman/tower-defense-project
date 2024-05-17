import { Router } from "express";
import { getConnection } from "./dbConnection";

export const router = Router();

router.get("/highScores", async (_, res) => {
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

router.post("/register", async (req, res) => {
  try {
    const { id, userName, hashedPassword, bestWave, achievedAt } = req.body;

    const connection = getConnection();

    await connection.execute(
      `INSERT INTO users (id, userName, hashedPassword)
        VALUES (?, ?, ?)`,
      [id, userName, hashedPassword]
    );

    await connection.execute(
      `INSERT INTO usersHighscores (userId, bestWave, achievedAt)
        VALUES (?, ?, ?)`,
      [id, bestWave, achievedAt]
    );

    res.status(201);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: "something went wrong" });
  }
});
