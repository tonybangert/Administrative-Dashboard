export default function SkeletonCard({ height = "h-[120px]", className = "" }) {
  return (
    <div className={`glass ${height} animate-pulse-skeleton ${className}`}>
      <div className="p-6 space-y-3">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}
