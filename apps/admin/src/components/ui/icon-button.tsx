// apps/admin/src/components/ui/icon-button.tsx
//
// Small square button for ↑ / ↓ / ✕ row controls. Previously copy-pasted into
// committees/schedule/documents/secretariat boards — now one component.
import { cn } from "@/lib/cn";

export function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded p-1 text-xs text-faint transition-colors disabled:opacity-30",
        danger
          ? "hover:bg-[#fdf1f1] hover:text-[#b23b3b]"
          : "hover:bg-wash hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
