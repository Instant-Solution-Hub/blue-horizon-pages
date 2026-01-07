import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardsProps {
  totalJoinings: number;
  onTime: number;
  early: number;
  late: number;
}

const StatsCards = ({ totalJoinings, onTime, early, late }: StatsCardsProps) => {
  const stats = [
    {
      label: "Total Joinings",
      value: totalJoinings,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "On Time",
      value: onTime,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Early",
      value: early,
      icon: ArrowUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Late",
      value: late,
      icon: ArrowDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
