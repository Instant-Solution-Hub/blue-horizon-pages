import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ScheduleItemProps {
  name: string;
  time: string;
  type: "doctor" | "pharmacy" | "stockist";
  description?: string;
}

const typeConfig = {
  doctor: {
    label: "doctor",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  pharmacy: {
    label: "pharmacy",
    className: "bg-success/10 text-success border-success/20",
  },
  stockist: {
    label: "stockist",
    className: "bg-stockist/10 text-stockist border-stockist/20",
  },
};

const ScheduleItem = ({ name, time, type, description }: ScheduleItemProps) => {
  const config = typeConfig[type];

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-200 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Calendar className="w-5 h-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{name}</h4>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>

      <Badge variant="outline" className={cn("capitalize flex-shrink-0", config.className)}>
        {config.label}
      </Badge>
    </div>
  );
};

export default ScheduleItem;