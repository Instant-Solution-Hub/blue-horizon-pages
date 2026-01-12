import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Umbrella } from "lucide-react";

interface ProfileStatsCardsProps {
  stats: {
    targetAchieved: number;
    targetSet: number;
    casualLeaves: number;
    approvedCasualLeaves: number;
    sickLeaves: number;
    approvedSickLeaves: number;
  } | null;

  monthlyLeavesTaken: number
  
}

const ProfileStatsCards = ({ stats , monthlyLeavesTaken }: ProfileStatsCardsProps ) => {


  if (!stats) return null;

  const targetRate = Math.round(
    (stats.targetAchieved / stats.targetSet) * 100
  );

    const totalWorkingDays = 26; // can later come from backend
const presentDays = totalWorkingDays - monthlyLeavesTaken;
const attendanceRate = Math.round(
  (presentDays / totalWorkingDays) * 100
);



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
                ₹{(stats.targetAchieved / 1000).toFixed(1)}K
              </span>
              <span className="text-sm text-muted-foreground">
                / ₹{(stats.targetSet / 1000).toFixed(0)}K
              </span>
            </div>
            <Progress value={targetRate} className="h-2 [&>div]:bg-green-500" />
            <p className="text-xs text-muted-foreground">
              {targetRate}% of monthly target
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
                  {stats.approvedCasualLeaves}/{stats.casualLeaves}
                </span>
              </div>
              <Progress 
                value={(stats.approvedCasualLeaves/ stats.casualLeaves) * 100} 
                className="h-2 [&>div]:bg-blue-500" 
              />
            </div>
            {/* Sick Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Sick Leave</span>
                <span className="text-xs font-medium text-foreground">
                  {stats.approvedSickLeaves}/{stats.sickLeaves}
                </span>
              </div>
              <Progress 
                value={(stats.approvedSickLeaves / stats.sickLeaves) * 100} 
                className="h-2 [&>div]:bg-amber-500" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStatsCards;
