import { Router } from "express";
import { getConnection } from "./dbConnection";

export const router = Router();

router.get("/highScores", async (_, res) => {
  try {
    const connection = getConnection();

    let sqlQuery = `
    SELECT defaultdb.users.userName, defaultdb.usersHighscores.bestWave, defaultdb.usersHighscores.achievedAt
    FROM defaultdb.users
    JOIN defaultdb.usersHighscores ON defaultdb.users.id = defaultdb.usersHighscores.userId
    ORDER BY defaultdb.usersHighscores.bestWave DESC
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
    const { id, userName, hashedPassword } = req.body;

    const connection = getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM defaultdb.users WHERE userName = ?`,
      [userName]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(409).json({ error: "Username already taken" });
    }

    await connection.execute(
      `INSERT INTO defaultdb.users (id, userName, hashedPassword)
          VALUES (?, ?, ?);`,
      [id, userName, hashedPassword]
    );

    res.status(201).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userName, hashedPassword } = req.body;

    const connection = getConnection();

    const [userRows] = await connection.execute(
      `SELECT * FROM defaultdb.users
          WHERE userName = ? AND hashedPassword = ?`,
      [userName, hashedPassword]
    );

    if (Array.isArray(userRows) && userRows.length > 0) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
