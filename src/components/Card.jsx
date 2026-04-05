function Card({ title, subtitle, action, children, className = "", interactive = false }) {
  return (
    <section
      className={`card-surface p-5 ${
        interactive ? "transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(232,121,249,0.18)]" : ""
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export default Card;
