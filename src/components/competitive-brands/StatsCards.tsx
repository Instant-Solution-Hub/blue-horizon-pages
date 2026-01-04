import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image, Bell } from "lucide-react";

interface StatsCardsProps {
  totalReports: number;
  withImages: number;
  managerNotified: number;
}

const StatsCards = ({ totalReports, withImages, managerNotified }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Reports",
      value: totalReports,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "With Images",
      value: withImages,
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Manager Notified",
      value: managerNotified,
      icon: Bell,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
