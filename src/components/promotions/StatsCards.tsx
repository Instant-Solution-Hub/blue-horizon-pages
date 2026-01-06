import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Zap, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalPromotions: number;
  activeCount: number;
  upcomingCount: number;
}

const StatsCards = ({ totalPromotions, activeCount, upcomingCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="border-border card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Promotions</p>
              <p className="text-2xl font-semibold">{totalPromotions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold">{activeCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stockist/10 rounded-lg">
              <Calendar className="h-5 w-5 text-stockist" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-semibold">{upcomingCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
