import type { Tag } from "../data";

export default function TechPill({ tag }: { tag: Tag }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-md text-ink/70"
      style={{
        border: "1px solid rgb(var(--color-line) / 0.08)",
        background: "rgb(var(--color-surface))",
      }}
    >
      {tag.icon && (
       <img src={tag.icon} alt={tag.name} width={20} height={20} className="flex-shrink-0 object-contain" loading="lazy" />
      )}
      {tag.name}
    </span>
  );
}