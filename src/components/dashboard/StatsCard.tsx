import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  trend,
  className,
  style,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border hover-lift card-shadow",
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-foreground">{value}</h3>
            {trend && (
              <span className="text-xs text-success font-medium">{trend}</span>
            )}
          </div>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;