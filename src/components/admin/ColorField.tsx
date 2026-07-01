import { parseColorList, resolveColor } from "@/lib/color-utils";

export function ColorSwatchPreview({ value }: { value: string }) {
  const colors = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!colors.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {colors.map((c, i) => (
        <span key={`${c}-${i}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="h-5 w-5 rounded-full ring-1 ring-border shadow-sm"
            style={{ background: resolveColor(c) }}
            title={resolveColor(c)}
          />
          {c}
        </span>
      ))}
    </div>
  );
}

export { parseColorList, resolveColor };
