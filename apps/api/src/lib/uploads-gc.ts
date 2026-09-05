// apps/api/src/lib/uploads-gc.ts
//
// Replacing or removing a file in the admin UI (committee image, topic
// report, resolution document, person photo, document file) only ever
// rewrites the DB column — the old file stays on disk under UPLOAD_DIR
// forever. This sweeps orphans away on demand.
import fs from "node:fs/promises";
import path from "node:path";
import { isNotNull } from "drizzle-orm";
import { committees, documents, people, resolutions, topics } from "@daemun/db";
import { db } from "../db";
import { env } from "../env";

/**
 * Minimum age before an unreferenced file is eligible for deletion. Covers
 * the gap between `POST /uploads` (file lands on disk) and the follow-up
 * `PATCH` that attaches its URL to a row — a sweep mid-gap must not delete
 * a file that's about to be referenced.
 */
const GRACE_MS = 10 * 60 * 1000;

function filenameOf(url: string): string | null {
  const m = /^\/uploads\/([^/]+)$/.exec(url);
  return m ? m[1] : null;
}

/** Every upload filename any table still points to. */
async function referencedFilenames(): Promise<Set<string>> {
  const [images, reports, docs, photos, files] = await Promise.all([
    db.select({ url: committees.image }).from(committees).where(isNotNull(committees.image)),
    db.select({ url: topics.report }).from(topics).where(isNotNull(topics.report)),
    db.select({ url: resolutions.document }).from(resolutions).where(isNotNull(resolutions.document)),
    db.select({ url: people.photo }).from(people).where(isNotNull(people.photo)),
    db.select({ url: documents.file }).from(documents),
  ]);

  const names = new Set<string>();
  for (const { url } of [...images, ...reports, ...docs, ...photos, ...files]) {
    if (!url) continue;
    const name = filenameOf(url);
    if (name) names.add(name);
  }
  return names;
}

export type UploadsGcReport = { scanned: number; deleted: string[]; freedBytes: number };

/** Deletes files under UPLOAD_DIR that no table references anymore. */
export async function sweepOrphanUploads(): Promise<UploadsGcReport> {
  const [live, entries] = await Promise.all([
    referencedFilenames(),
    fs.readdir(env.uploadDir, { withFileTypes: true }),
  ]);

  const now = Date.now();
  const deleted: string[] = [];
  let freedBytes = 0;
  for (const entry of entries) {
    if (!entry.isFile() || live.has(entry.name)) continue;
    const full = path.join(env.uploadDir, entry.name);
    const stat = await fs.stat(full);
    if (now - stat.mtimeMs < GRACE_MS) continue;
    freedBytes += stat.size;
    await fs.unlink(full);
    deleted.push(entry.name);
  }
  return { scanned: entries.length, deleted, freedBytes };
}
