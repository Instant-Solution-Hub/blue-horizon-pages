import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, DollarSign } from "lucide-react";

const ProfileStatsCards = () => {
  const attendanceData = {
    present: 22,
    total: 26,
    rate: Math.round((22 / 26) * 100),
  };

  const targetData = {
    monthly: 150000,
    achieved: 112500,
    rate: Math.round((112500 / 150000) * 100),
  };

  const incentiveData = {
    thisMonth: 8500,
    lastMonth: 7200,
    yearTotal: 45800,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Attendance Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="text-xs text-muted-foreground/70">This Month</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                {attendanceData.present}/{attendanceData.total}
              </span>
              <span className="text-sm font-medium text-primary">
                {attendanceData.rate}%
              </span>
            </div>
            <Progress value={attendanceData.rate} className="h-2" />
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>
        </CardContent>
      </Card>

      {/* Target Achieved Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Achieved</p>
              <p className="text-xs text-muted-foreground/70">Monthly</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-foreground">
                ₹{(targetData.achieved / 1000).toFixed(1)}K
              </span>
              <span className="text-sm text-muted-foreground">
                / ₹{(targetData.monthly / 1000).toFixed(0)}K
              </span>
            </div>
            <Progress value={targetData.rate} className="h-2 [&>div]:bg-green-500" />
            <p className="text-xs text-muted-foreground">
              {targetData.rate}% of monthly target
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Incentive Details Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incentive Details</p>
              <p className="text-xs text-muted-foreground/70">Earnings</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">This Month</span>
              <span className="text-sm font-semibold text-foreground">
                ₹{incentiveData.thisMonth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last Month</span>
              <span className="text-sm font-medium text-muted-foreground">
                ₹{incentiveData.lastMonth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Year Total</span>
              <span className="text-sm font-bold text-primary">
                ₹{incentiveData.yearTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStatsCards;
