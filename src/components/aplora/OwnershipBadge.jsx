import { User } from "lucide-react";

export default function OwnershipBadge({ owner, size = "sm", className = "" }) {
  if (!owner) return null;

  const initials = owner.includes("@")
    ? owner.split("@")[0].slice(0, 2).toUpperCase()
    : owner.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const sizeClasses = size === "sm" ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs";

  return (
    <div className={`flex items-center gap-1.5 ${className}`} title={`Owner: ${owner}`}>
      <div className={`${sizeClasses} rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-medium shrink-0`}>
        {initials || <User className="w-3 h-3" />}
      </div>
      {size === "md" && (
        <span className="text-xs text-text-muted truncate max-w-[120px]">{owner}</span>
      )}
    </div>
  );
}
