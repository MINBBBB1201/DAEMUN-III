import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = ReturnType<typeof createDb>;

export function databaseUrl() {
  return (
    process.env.DATABASE_URL ?? "postgres://daemun:daemun@localhost:5432/daemun"
  );
}

export function createDb(connectionString = databaseUrl()) {
  const pool = new Pool({ connectionString });
  return drizzle({ client: pool, schema });
}

export { schema };
export * from "./schema";
