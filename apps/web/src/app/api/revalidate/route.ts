import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { SITE_TAG } from "@/lib/site";

/**
 * Called by the API after any admin mutation. Expires the cached site payload
 * immediately so the next visitor sees fresh data (resolution statuses change
 * live during the conference, so stale-while-revalidate is not enough).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 503 });
  }
  if (req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SITE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
