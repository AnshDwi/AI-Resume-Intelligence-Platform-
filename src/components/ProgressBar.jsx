function ProgressBar({ value }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full rounded-full bg-slate-200">
      <div
        className="h-2.5 rounded-full bg-brand-600 transition-all duration-500"
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}

export default ProgressBar;
