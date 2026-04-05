function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white/10 ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-white/5" />
      <div className="skeleton-shimmer absolute inset-y-0 -left-1/2 w-1/2" />
    </div>
  );
}

export default LoadingSkeleton;
