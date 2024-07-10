import process from "node:process";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let dsl: PostgresJsDatabase<Record<string, unknown>>;

const db = () => {
  if (!dsl) {
    const connection = postgres(process.env.DB_URL);
    dsl = drizzle(connection);
  }
  return dsl;
};

export default db;
