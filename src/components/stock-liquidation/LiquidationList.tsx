import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, X, Package } from "lucide-react";
import { LiquidationPlan } from "./AddLiquidationModal";
import { useToast } from "@/hooks/use-toast";
import { ProductStock } from "./StockUpdateTab";
import { cn } from "@/lib/utils";

interface LiquidationListProps {
  plans: LiquidationPlan[];
  onUpdate: (plan: LiquidationPlan, data: Partial<LiquidationPlan>) => void;
  stockData: ProductStock[];
}

const LiquidationList = ({ plans, onUpdate, stockData }: LiquidationListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<LiquidationPlan>>({});
  const [blockEditValues, setBlockEditValues] = useState<
    Record<string, { liquidated1: number; liquidated2: number; liquidated3: number }>
  >({});
  const { toast } = useToast();

  const getProductStock = (productName: string) => {
    const stock = stockData.find((s) => s.name === productName);
    return stock?.availableQty ?? 0;
  };

  const getBlockValue = (plan: LiquidationPlan, blockNum: 1 | 2 | 3) => {
    const saved = blockEditValues[plan.id];
    if (saved) {
      return blockNum === 1
        ? saved.liquidated1
        : blockNum === 2
        ? saved.liquidated2
        : saved.liquidated3;
    }
    return blockNum === 1
      ? plan.liquidated1 ?? 0
      : blockNum === 2
      ? plan.liquidated2 ?? 0
      : plan.liquidated3 ?? 0;
  };

  const setBlockValue = (plan: LiquidationPlan, blockNum: 1 | 2 | 3, value: number) => {
    setBlockEditValues((prev) => ({
      ...prev,
      [plan.id]: {
        liquidated1: prev[plan.id]?.liquidated1 ?? plan.liquidated1 ?? 0,
        liquidated2: prev[plan.id]?.liquidated2 ?? plan.liquidated2 ?? 0,
        liquidated3: prev[plan.id]?.liquidated3 ?? plan.liquidated3 ?? 0,
        ...(blockNum === 1
          ? { liquidated1: value }
          : blockNum === 2
          ? { liquidated2: value }
          : { liquidated3: value }),
      },
    }));
  };

  const getTotalTargetForProduct = (product: string, excludePlanId?: string) => {
    return plans
      .filter((p) => p.product === product && p.id !== excludePlanId)
      .reduce((sum, p) => sum + (p.targetLiquidation || 0), 0);
  };

  // Group plans by product
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.product]) {
      acc[plan.product] = [];
    }
    acc[plan.product].push(plan);
    return acc;
  }, {} as Record<string, LiquidationPlan[]>);

  const sortedProducts = Object.keys(groupedPlans).sort();

  const handleEdit = (plan: LiquidationPlan) => {
    setEditingId(plan.id);
    setEditValues({
      targetLiquidation: plan.targetLiquidation,
      marketName: plan.marketName,
      medicalShopName: plan.medicalShopName,
    });
  };

  const handleSave = (plan: LiquidationPlan) => {
    const existingTotal = getTotalTargetForProduct(plan.product, plan.id);
    const newTarget = editValues.targetLiquidation ?? plan.targetLiquidation;

    if (existingTotal + newTarget > plan.quantity) {
      toast({
        title: "Cannot save",
        description: "Total target liquidation exceeds available stock.",
        variant: "destructive",
      });
      return;
    }

    onUpdate(plan, editValues);
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
              {groupedPlans[product].map((plan) => {
                const l1 = plan.liquidated1 ?? 0;
                const l2 = plan.liquidated2 ?? 0;
                const l3 = plan.liquidated3 ?? 0;
                const totalLiquidated = l1 + l2 + l3;
                const progress = plan.targetLiquidation
                  ? Math.min(100, Math.round((totalLiquidated / plan.targetLiquidation) * 100))
                  : 0;
                const day = new Date().getDate();
                const activeBlock = day <= 10 ? 1 : day <= 20 ? 2 : 3;

                const renderBlockCard = (
                  blockNum: 1 | 2 | 3,
                  value: number,
                  label: string,
                  range: string
                ) => {
                  const isActive = activeBlock === blockNum;
                  const isPast = activeBlock > blockNum;
                  const others =
                    totalLiquidated -
                    (blockNum === 1 ? l1 : blockNum === 2 ? l2 : l3);
                  const maxAllowed = Math.max(0, plan.targetLiquidation - others);
                  const key =
                    blockNum === 1
                      ? "liquidated1"
                      : blockNum === 2
                      ? "liquidated2"
                      : "liquidated3";

                  return (
                    <div
                      className={cn(
                        "rounded-lg border p-3 transition-colors",
                        isActive
                          ? "border-primary/40 bg-primary/5"
                          : "bg-muted/30"
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
                      <Input
                        type="number"
                        min={0}
                        max={maxAllowed}
                        value={getBlockValue(plan, blockNum)}
                        disabled={!isActive}
                        onChange={(e) => {
                          let nextValue = Number(e.target.value) || 0;
                          if (nextValue < 0) nextValue = 0;
                          if (nextValue > maxAllowed) nextValue = maxAllowed;

                          setBlockValue(plan, blockNum, nextValue);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && isActive) {
                            const current = blockEditValues[plan.id] || {
                              liquidated1: plan.liquidated1 ?? 0,
                              liquidated2: plan.liquidated2 ?? 0,
                              liquidated3: plan.liquidated3 ?? 0,
                            };

                            onUpdate(plan, {
                              liquidated1: current.liquidated1,
                              liquidated2: current.liquidated2,
                              liquidated3: current.liquidated3,
                            });
                          }
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                  );
                };

                return (
                  <div
                    key={plan.id}
                    className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                  >
                    {editingId === plan.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground">Doctor</label>
                            <p className="font-medium">{plan.doctor}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Available Qty</label>
                            <p className="font-medium">{getProductStock(plan.product)}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Target Liquidation</label>
                            <Input
                              type="number"
                              value={editValues.targetLiquidation}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                const existingTotal = getTotalTargetForProduct(plan.product, plan.id);
                                const maxAllowed = plan.quantity - existingTotal;
                                if (value > maxAllowed) {
                                  toast({
                                    title: "Invalid quantity",
                                    description: `Maximum allowed for this product is ${maxAllowed}.`,
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                setEditValues({
                                  ...editValues,
                                  targetLiquidation: value,
                                });
                              }}
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
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSave(plan)}>
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Doctor</p>
                            <p className="font-semibold text-base text-foreground">{plan.doctor}</p>
                          </div>
                          <div className="flex items-center gap-2">
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
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(plan)}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-muted/30 p-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Available Qty</p>
                            <p className="font-medium text-sm">{getProductStock(plan.product)}</p>
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

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-medium text-foreground">Liquidation Progress</p>
                            <p className="text-xs text-muted-foreground">
                              {totalLiquidated} / {plan.targetLiquidation} ({progress}%)
                            </p>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {renderBlockCard(1, l1, "Block 1", "Day 1 – 10")}
                          {renderBlockCard(2, l2, "Block 2", "Day 11 – 20")}
                          {renderBlockCard(3, l3, "Block 3", "Day 21 – 30")}
                        </div>
                      </div>
                    )}
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

export default LiquidationList;
