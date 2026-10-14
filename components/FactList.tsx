type Fact = { label: string; value: string };

/**
 * One fact per line, label left and value right: the shape a technical reader
 * scans, rather than cells competing for the same glance. Shared by the project
 * card and the case-study page, for both the specification and the results, so
 * the renderings cannot drift apart.
 */
export function FactList({ items }: { items: Fact[] }) {
  return (
    <dl className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-bright/10 py-3 first:pt-0 last:border-b-0 last:pb-0"
        >
          <dt className="label-mono w-28 shrink-0 text-muted">{item.label}</dt>
          <dd className="text-sm leading-snug text-bright">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
