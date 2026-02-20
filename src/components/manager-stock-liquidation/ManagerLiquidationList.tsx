import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle2, XCircle, Clock } from "lucide-react";
import { LiquidationPlan } from "@/components/stock-liquidation/AddLiquidationModal";
import { useToast } from "@/hooks/use-toast";

interface ManagerLiquidationListProps {
  plans: LiquidationPlan[];
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED") => void;
}

const ManagerLiquidationList = ({ plans, onUpdateStatus }: ManagerLiquidationListProps) => {
  const { toast } = useToast();

  // Group plans by product
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.product]) {
      acc[plan.product] = [];
    }
    acc[plan.product].push(plan);
    return acc;
  }, {} as Record<string, (LiquidationPlan & { submittedBy?: string; rejectedReason?: string })[]>);

  const sortedProducts = Object.keys(groupedPlans).sort();

  const handleApprove = (id: string) => {
    onUpdateStatus(id, "APPROVED");
    toast({ title: "Approved", description: "Liquidation plan has been approved." });
  };

  const handleReject = (id: string) => {
    onUpdateStatus(id, "REJECTED");
    toast({ title: "Rejected", description: "Liquidation plan has been rejected.", variant: "destructive" });
  };

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
            No liquidation plans submitted by your team yet.
          </p>
        </CardContent>
      </Card>
    );
  }

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
              {groupedPlans[product].map((plan) => (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 flex-1">
                       <div>
                        <p className="text-xs text-muted-foreground">Doctor</p>
                        <p className="font-medium text-sm">{plan.doctor}</p>
                      </div>
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
                        <p className="text-xs text-muted-foreground">Status</p>
                        {getStatusBadge(plan.status)}
                      </div>
                    </div>
                    {plan.status === "PENDING" && (
                      <div className="flex gap-2 self-end lg:self-center">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(plan.id)}
                          className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </Button>
                       
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManagerLiquidationList;
