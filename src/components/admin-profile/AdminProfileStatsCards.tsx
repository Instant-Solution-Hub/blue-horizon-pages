import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Building2, Umbrella } from "lucide-react";

interface Props {
  stats?: any | null;
  monthlyConfirmed?: number | null;
}

const AdminProfileStatsCards = ({ stats, monthlyConfirmed }: Props) => {
  if (!stats) return null;

  const totalWorkingDays = 26;
  const monthlyLeavesTaken = monthlyConfirmed ?? 0;
  const presentDays = totalWorkingDays - monthlyLeavesTaken;
  const attendanceRate = Math.round((presentDays / totalWorkingDays) * 100);

  const companyTargetData = {
    monthly: stats.targetSet ?? 0,
    achieved: stats.targetAchieved ?? 0,
    rate: stats.targetSet > 0 ? Math.round(((stats.targetAchieved ?? 0) / stats.targetSet) * 100) : 0,
    totalMembers: stats.totalMembers ?? 0,
  };

  const leaveData = {
    casualLeave: { used: stats.approvedCasualLeaves ?? 0, total: stats.casualLeaves ?? 0 },
    sickLeave: { used: stats.approvedSickLeaves ?? 0, total: stats.sickLeaves ?? 0 },
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
                {presentDays}/{totalWorkingDays}
              </span>
              <span className="text-sm font-medium text-primary">
                {attendanceRate}%
              </span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Company Target Achieved Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Target Achieved</p>
              <p className="text-xs text-muted-foreground/70">{companyTargetData.totalMembers} Members</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-foreground">
                ₹{(companyTargetData.achieved / 100000).toFixed(1)}L
              </span>
              <span className="text-sm text-muted-foreground">
                / ₹{(companyTargetData.monthly / 100000).toFixed(1)}L
              </span>
            </div>
            <Progress value={companyTargetData.rate} className="h-2 [&>div]:bg-green-500" />
            <p className="text-xs text-muted-foreground">
              {companyTargetData.rate}% of company target
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Leave Progress Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Umbrella className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Leave Balance</p>
              <p className="text-xs text-muted-foreground/70">This Year</p>
            </div>
          </div>
          <div className="space-y-3">
            {/* Casual Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Casual Leave</span>
                <span className="text-xs font-medium text-foreground">
                  {leaveData.casualLeave.used}/{leaveData.casualLeave.total}
                </span>
              </div>
              <Progress 
                value={(leaveData.casualLeave.used / leaveData.casualLeave.total) * 100} 
                className="h-2 [&>div]:bg-blue-500" 
              />
            </div>
            {/* Sick Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Sick Leave</span>
                <span className="text-xs font-medium text-foreground">
                  {leaveData.sickLeave.used}/{leaveData.sickLeave.total}
                </span>
              </div>
              <Progress 
                value={(leaveData.sickLeave.used / leaveData.sickLeave.total) * 100} 
                className="h-2 [&>div]:bg-amber-500" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileStatsCards;
