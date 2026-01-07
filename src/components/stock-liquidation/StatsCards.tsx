import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, Target, CheckCircle } from "lucide-react";
import { LiquidationPlan } from "./AddLiquidationModal";

interface StatsCardsProps {
  plans: LiquidationPlan[];
}

const StatsCards = ({ plans }: StatsCardsProps) => {
  const activePlans = plans.length;
  const pendingApproval = plans.filter((p) => p.status === "PENDING").length;
  const targetUnits = plans.reduce((sum, p) => sum + p.targetLiquidation, 0);
  const achievedUnits = plans.reduce((sum, p) => sum + p.achievedUnits, 0);

  const stats = [
    {
      title: "Active Plans",
      value: activePlans,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Approval",
      value: pendingApproval,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Target Units",
      value: targetUnits.toLocaleString(),
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Achieved Units",
      value: achievedUnits.toLocaleString(),
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
};

export default StatsCards;
