function ProgressCircle({ value, size = 120, stroke = 12, label = "Match Score" }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  const background = `conic-gradient(#2f6df6 ${normalized * 3.6}deg, #e2e8f0 0deg)`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid place-items-center rounded-full transition-all duration-300"
        style={{
          width: size,
          height: size,
          background
        }}
      >
        <div
          className="grid place-items-center rounded-full bg-white"
          style={{
            width: size - stroke * 2,
            height: size - stroke * 2
          }}
        >
          <span className="text-2xl font-bold text-slate-900">{normalized}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

export default ProgressCircle;
