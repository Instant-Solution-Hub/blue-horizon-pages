import { useState } from "react";
import { Target, TrendingUp, Edit2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)} K`;
  return `₹${value.toFixed(2)}`;
};

const CompanyTargetSection = () => {
  const [companyTarget, setCompanyTarget] = useState(5000000);
  const [companyProgress, setCompanyProgress] = useState(3200000);
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState("");
  const [editProgress, setEditProgress] = useState("");

  const percentage = companyTarget > 0 ? Math.min((companyProgress / companyTarget) * 100, 100) : 0;

  const handleEdit = () => {
    setEditTarget(companyTarget.toString());
    setEditProgress(companyProgress.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const newTarget = parseFloat(editTarget);
    const newProgress = parseFloat(editProgress);
    if (!isNaN(newTarget) && newTarget > 0) setCompanyTarget(newTarget);
    if (!isNaN(newProgress) && newProgress >= 0) setCompanyProgress(newProgress);
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <Card className="border-primary/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Company Target & Progress</h2>
              <p className="text-sm text-muted-foreground">Overall company sales performance</p>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Company Target (₹)</label>
              <Input
                type="number"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                placeholder="Enter target amount"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Current Progress (₹)</label>
              <Input
                type="number"
                value={editProgress}
                onChange={(e) => setEditProgress(e.target.value)}
                placeholder="Enter progress amount"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Target</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(companyTarget)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Achieved</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(companyProgress)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Deficit</p>
              <p className="text-xl font-bold text-destructive">
                {companyProgress >= companyTarget ? "—" : formatCurrency(companyTarget - companyProgress)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Progress
            </span>
            <span className="font-semibold text-foreground">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyTargetSection;
