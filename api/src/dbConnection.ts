import { createConnection, Connection } from "mysql2/promise";

let connection: Connection | undefined;

export function getConnection() {
  if (!connection) {
    throw new Error("Must init connection first!");
  }

  return connection;
}

export async function initConnection() {
  let port: number;

  if (process.env.DB_PORT !== undefined) {
    port = parseInt(process.env.DB_PORT);
  } else {
    throw new Error("DB_PORT environment variable is not defined.");
  }

  connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: port,
    database: "defaultdb",
  });
}
