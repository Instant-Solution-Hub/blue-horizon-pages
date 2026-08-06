import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, CheckCircle2, XCircle, Clock } from "lucide-react";
import { LiquidationPlan } from "@/components/stock-liquidation/AddLiquidationModal";
import { cn } from "@/lib/utils";

interface AdminLiquidationListProps {
  plans: LiquidationPlan[];
}

const AdminLiquidationList = ({ plans }: AdminLiquidationListProps) => {
    console.log("AdminLiquidationList plans:", plans);
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.product]) acc[plan.product] = [];
    acc[plan.product].push(plan);
    return acc;
  }, {} as Record<string, LiquidationPlan[]>);

  const sortedProducts = Object.keys(groupedPlans).sort();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 gap-1">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
    }
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No liquidation plans found for the selected employee.
          </p>
        </CardContent>
      </Card>
    );
  }

  const day = new Date().getDate();
  const activeBlock = day <= 10 ? 1 : day <= 20 ? 2 : 3;

  const renderBlockCard = (blockNum: 1 | 2 | 3, value: number, label: string, range: string) => {
    const isActive = activeBlock === blockNum;
    const isPast = activeBlock > blockNum;
    return (
      <div
        className={cn(
          "rounded-lg border p-3 transition-colors",
          isActive ? "border-primary/40 bg-primary/5" : "bg-muted/30",
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-foreground">{label}</p>
          {isActive ? (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-1.5 py-0">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {isPast ? "Closed" : "Upcoming"}
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">{range}</p>
        <Input type="number" value={value} disabled className="h-8 text-sm" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {sortedProducts.map((product) => (
        <Card key={product}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              {product}
              <Badge variant="secondary" className="ml-2">
                {groupedPlans[product].length} plan(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupedPlans[product].map((plan) => {
                const l1 = plan.liquidated1 ?? 0;
                const l2 = plan.liquidated2 ?? 0;
                const l3 = plan.liquidated3 ?? 0;
                const total = l1 + l2 + l3;
                const progress = plan.targetLiquidation
                  ? Math.min(100, Math.round((total / plan.targetLiquidation) * 100))
                  : 0;

                return (
                  <div
                    key={plan.id}
                    className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Doctor</p>
                        <p className="font-semibold text-base text-foreground">{plan.doctor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-muted/30 p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Available Qty</p>
                        <p className="font-medium text-sm">{plan.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-medium text-sm text-primary">{plan.targetLiquidation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Market</p>
                        <p className="font-medium text-sm">{plan.marketName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Medical Shop</p>
                        <p className="font-medium text-sm">{plan.medicalShopName || "-"}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-foreground">Liquidation Progress</p>
                        <p className="text-xs text-muted-foreground">
                          {total} / {plan.targetLiquidation} ({progress}%)
                        </p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {renderBlockCard(1, l1, "Block 1", "Day 1 – 10")}
                      {renderBlockCard(2, l2, "Block 2", "Day 11 – 20")}
                      {renderBlockCard(3, l3, "Block 3", "Day 21 – 30")}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminLiquidationList;
