import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface ManagerJoiningStatsProps {
  totalJoinings: number;
  totalFEs: number;
  onTime: number;
  late: number;
}

const ManagerJoiningStats = ({ totalJoinings, totalFEs, onTime, late }: ManagerJoiningStatsProps) => {
  const stats = [
    {
      label: "Total Joinings",
      value: totalJoinings,
      icon: Clock,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Field Executives",
      value: totalFEs,
      icon: Users,
      className: "bg-blue-100 text-blue-700",
    },
    {
      label: "On Time",
      value: onTime,
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
    },
    {
      label: "Late",
      value: late,
      icon: AlertTriangle,
      className: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.className}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManagerJoiningStats;
