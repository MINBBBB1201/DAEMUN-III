import { createDb } from "@daemun/db";
import { env } from "./env";

export const db = createDb(env.databaseUrl);
export type { Db } from "@daemun/db";
