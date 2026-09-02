import { env } from "../env";

let pending: NodeJS.Timeout | null = null;

/**
 * Tell the public site its cached data is stale. Debounced so a burst of
 * admin edits only produces one webhook call. Fire-and-forget: failures are
 * logged, never surfaced to the admin request.
 */
export function revalidateWeb() {
  if (!env.revalidateSecret) return;
  if (pending) clearTimeout(pending);
  pending = setTimeout(async () => {
    pending = null;
    try {
      const res = await fetch(`${env.webUrl}/api/revalidate`, {
        method: "POST",
        headers: { "x-revalidate-secret": env.revalidateSecret },
      });
      if (!res.ok) console.warn(`[revalidate] web responded ${res.status}`);
    } catch (err) {
      console.warn("[revalidate] failed:", (err as Error).message);
    }
  }, 300);
}
