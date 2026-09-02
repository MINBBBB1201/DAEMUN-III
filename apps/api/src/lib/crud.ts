import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { asc, eq, sql, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { ZodType } from "zod";
import { reorderSchema } from "@daemun/shared";
import { db } from "../db";
import { revalidateWeb } from "./revalidate";

/**
 * A table this factory can manage: text `id` plus an integer `sortOrder`.
 * Every content table in @daemun/db matches this shape.
 */
type OrderedTable = PgTable & {
  id: PgColumn;
  sortOrder: PgColumn;
  createdAt: PgColumn;
};

type CrudOptions<T extends OrderedTable> = {
  table: T;
  create: ZodType;
  update: ZodType;
  /** Extra ordering applied before sortOrder (e.g. group by parent). */
  orderBy?: (t: T) => SQL[];
};

/**
 * Builds list / create / patch / delete / reorder routes for one table.
 * Rows are always returned ordered by sortOrder, then creation time, so the
 * admin panel and the public site agree on ordering.
 */
export function crudRoutes<T extends OrderedTable>(opts: CrudOptions<T>) {
  const { table } = opts;
  const app = new Hono();

  const order = () => [
    ...(opts.orderBy?.(table) ?? []),
    asc(table.sortOrder),
    asc(table.createdAt),
  ];

  app.get("/", async (c) => {
    const rows = await db.select().from(table as PgTable).orderBy(...order());
    return c.json(rows);
  });

  app.post("/", zValidator("json", opts.create), async (c) => {
    const body = c.req.valid("json") as Record<string, unknown>;
    const [{ next }] = await db
      .select({ next: sql<number>`coalesce(max(${table.sortOrder}), -1) + 1` })
      .from(table as PgTable);
    const [row] = await db
      .insert(table as PgTable)
      .values({ id: randomUUID(), sortOrder: Number(next), ...body })
      .returning();
    revalidateWeb();
    return c.json(row, 201);
  });

  app.patch("/:id", zValidator("json", opts.update), async (c) => {
    const body = c.req.valid("json") as Record<string, unknown>;
    const [row] = await db
      .update(table as PgTable)
      .set(body)
      .where(eq(table.id, c.req.param("id")))
      .returning();
    if (!row) return c.json({ error: "Not found" }, 404);
    revalidateWeb();
    return c.json(row);
  });

  app.delete("/:id", async (c) => {
    const [row] = await db
      .delete(table as PgTable)
      .where(eq(table.id, c.req.param("id")))
      .returning();
    if (!row) return c.json({ error: "Not found" }, 404);
    revalidateWeb();
    return c.json({ ok: true });
  });

  app.put("/reorder", zValidator("json", reorderSchema), async (c) => {
    const { ids } = c.req.valid("json");
    await db.transaction(async (tx) => {
      for (const [index, rowId] of ids.entries()) {
        await tx
          .update(table as PgTable)
          .set({ sortOrder: index })
          .where(eq(table.id, rowId));
      }
    });
    revalidateWeb();
    return c.json({ ok: true });
  });

  return app;
}
