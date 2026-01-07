import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, X, Package } from "lucide-react";
import { LiquidationPlan } from "./AddLiquidationModal";

interface LiquidationListProps {
  plans: LiquidationPlan[];
  onUpdate: (id: string, data: Partial<LiquidationPlan>) => void;
}

const LiquidationList = ({ plans, onUpdate }: LiquidationListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<LiquidationPlan>>({});

  // Group plans by product
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.product]) {
      acc[plan.product] = [];
    }
    acc[plan.product].push(plan);
    return acc;
  }, {} as Record<string, LiquidationPlan[]>);

  // Sort products alphabetically
  const sortedProducts = Object.keys(groupedPlans).sort();

  const handleEdit = (plan: LiquidationPlan) => {
    setEditingId(plan.id);
    setEditValues({
      targetLiquidation: plan.targetLiquidation,
      marketName: plan.marketName,
      medicalShopName: plan.medicalShopName,
    });
  };

  const handleSave = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No liquidation plans yet. Click "Add New Liquidation Plan" to create one.
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
                  {editingId === plan.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Doctor</label>
                          <p className="font-medium">{plan.doctor}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Available Qty</label>
                          <p className="font-medium">{plan.quantity}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Target Liquidation</label>
                          <Input
                            type="number"
                            value={editValues.targetLiquidation}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                targetLiquidation: Number(e.target.value),
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Market Name</label>
                          <Input
                            value={editValues.marketName}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                marketName: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Medical Shop (Optional)</label>
                          <Input
                            value={editValues.medicalShopName || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                medicalShopName: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSave(plan.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
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
                          <p className="font-medium text-sm text-primary">
                            {plan.targetLiquidation}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Market</p>
                          <p className="font-medium text-sm">{plan.marketName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Medical Shop</p>
                          <p className="font-medium text-sm">
                            {plan.medicalShopName || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge
                            variant={plan.status === "APPROVED" ? "default" : "secondary"}
                            className={
                              plan.status === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                            }
                          >
                            {plan.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(plan)}
                        className="self-end lg:self-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiquidationList;
