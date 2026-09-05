// apps/admin/src/components/ui/button.tsx
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  // Deep navy, like the public site's primary action
  primary: "bg-navy text-white hover:opacity-90 disabled:opacity-60",
  // Outlined — the default for "Refresh" etc.
  secondary:
    "border border-line bg-white text-ink hover:bg-wash disabled:opacity-50",
  // Dashed placeholder — "Add …"
  ghost:
    "border border-dashed border-line text-muted hover:border-faint hover:text-ink disabled:opacity-50",
  danger:
    "border border-line text-[#b23b3b] hover:bg-[#fdf1f1] hover:border-[#e5c4c4] disabled:opacity-50",
};

export function Button({
  className,
  variant = "secondary",
  ...props
}: React.ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-[opacity,background-color,border-color] disabled:cursor-not-allowed",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
