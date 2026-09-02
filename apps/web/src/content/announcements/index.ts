import type { ComponentType } from "react";

/**
 * Announcements registry.
 *
 * To post a notice: add a .mdx file in this folder that exports
 *   export const meta = { title, date: "YYYY-MM-DD", urgent?: boolean }
 * then import it below. Newest date renders first; urgent ones are pinned
 * to the top with a highlighted band.
 */
import * as WebsiteLaunch from "./2026-09-01-website-launch.mdx";

export type AnnouncementMeta = {
  title: string;
  date: string;
  urgent?: boolean;
};

export type Announcement = AnnouncementMeta & {
  slug: string;
  Body: ComponentType;
};

type MdxModule = { default: ComponentType; meta: AnnouncementMeta };

/** @types/mdx only declares `default`; the meta export is ours, so cast. */
function entry(slug: string, mod: unknown): Announcement {
  const m = mod as MdxModule;
  return { slug, ...m.meta, Body: m.default };
}

export const announcements: Announcement[] = [
  entry("website-launch", WebsiteLaunch),
].sort((a, b) => {
  if (!!a.urgent !== !!b.urgent) return a.urgent ? -1 : 1;
  return b.date.localeCompare(a.date);
});
