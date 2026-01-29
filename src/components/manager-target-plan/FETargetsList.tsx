import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Target } from "lucide-react";

interface FETarget {
  id: string;
  name: string;
  territory: string;
  primaryTarget: number;
  secondaryTarget: number;
}

interface FETargetsListProps {
  targets: FETarget[];
}

const FETargetsList = ({ targets }: FETargetsListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (targets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No targets set yet. Click "Set Target" to add monthly targets for Field Executives.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {targets.map((target) => (
        <Card key={target.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{target.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {target.territory}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Primary Target</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(target.primaryTarget)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Secondary Target</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(target.secondaryTarget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FETargetsList;
