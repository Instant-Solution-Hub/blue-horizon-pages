import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  scheduled: number;
  completed: number;
  missed: number;
  complianceRate: number;
}

export function StatsCards({ scheduled, completed, missed, complianceRate }: StatsCardsProps) {
  const stats = [
    {
      title: "Scheduled Visits",
      value: scheduled,
      icon: CalendarCheck,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Missed",
      value: missed,
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Compliance Rate",
      value: `${complianceRate}%`,
      icon: TrendingUp,
      iconColor: complianceRate >= 80 ? "text-green-500" : "text-amber-500",
      bgColor: complianceRate >= 80 ? "bg-green-50" : "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
