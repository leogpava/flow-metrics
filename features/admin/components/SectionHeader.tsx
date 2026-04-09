interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
}

export function SectionHeader({ eyebrow, title, description, meta }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p> : null}
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {meta ? <p className="text-sm text-slate-500">{meta}</p> : null}
    </div>
  );
}
