// apps/admin/src/components/ui/card.tsx
import { cn } from "@/lib/cn";

/**
 * The one surface every screen sits on: white, hairline border in the brand
 * "line" tone, a whisper of shadow. Matches the public site's editorial cards.
 */
export function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(10,20,40,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

/** Optional muted header strip inside a Card (committee name, day label…). */
export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-2 border-b border-line bg-wash/60 px-4 py-2.5",
        className,
      )}
      {...props}
    />
  );
}
