export default function PageHeader({ badge, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl fade-in-up">
        {badge ? (
          <span className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            {badge}
          </span>
        ) : null}
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">{description}</p>
      </div>
      {actions ? <div className="fade-in">{actions}</div> : null}
    </div>
  );
}
