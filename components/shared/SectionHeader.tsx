export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-balance text-3xl font-black md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
