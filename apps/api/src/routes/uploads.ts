import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Hono } from "hono";
import { env } from "../env";
import { sweepOrphanUploads } from "../lib/uploads-gc";

const ALLOWED: Record<string, string> = {
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".webp": "image",
  ".pdf": "PDF",
  ".doc": "DOC",
  ".docx": "DOC",
};

function humanSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * `POST /api/admin/uploads` — multipart with a single `file` field.
 * Stores the file under UPLOAD_DIR and returns a path the frontends can
 * reference directly (they proxy `/uploads/*` to this server).
 */
export const uploadRoutes = new Hono()
  /**
   * `POST /api/admin/uploads/gc` — deletes files under UPLOAD_DIR that no
   * table references anymore (a replaced or removed upload never deletes
   * the old file itself). See lib/uploads-gc.ts.
   */
  .post("/gc", async (c) => c.json(await sweepOrphanUploads()))
  .post("/", async (c) => {
    const body = await c.req.parseBody();
    const file = body["file"];
    if (!(file instanceof File)) {
      return c.json({ error: "Expected a multipart `file` field" }, 400);
    }

    const ext = path.extname(file.name).toLowerCase();
    const kind = ALLOWED[ext];
    if (!kind) {
      return c.json(
        { error: `Unsupported file type ${ext || "(none)"}`, allowed: Object.keys(ALLOWED) },
        415,
      );
    }
    if (file.size > env.maxUploadBytes) {
      return c.json({ error: `File exceeds ${humanSize(env.maxUploadBytes)}` }, 413);
    }

    const name = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(env.uploadDir, name), Buffer.from(await file.arrayBuffer()));

    return c.json(
      {
        url: `/uploads/${name}`,
        originalName: file.name,
        kind,
        bytes: file.size,
        size: humanSize(file.size),
      },
      201,
    );
  });
