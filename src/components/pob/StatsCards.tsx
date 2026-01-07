import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Clock, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  totalOrders: number;
  totalValue: number;
  pending: number;
  confirmed: number;
}

const StatsCards = ({ totalOrders, totalValue, pending, confirmed }: StatsCardsProps) => {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Value",
      value: `₹${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
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
                <p className="text-sm text-muted-foreground">{stat.label}</p>
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
