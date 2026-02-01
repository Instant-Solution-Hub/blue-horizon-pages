import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  totalVisitsToday: number;
  targetAchieved: number;
}

interface TeamPerformanceTableProps {
  teamMembers: TeamMember[];
}

const TeamPerformanceTable = ({ teamMembers }: TeamPerformanceTableProps) => {
  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-success/10 text-success border-success/20">On Track</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Moderate</Badge>;
    } else {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Behind</Badge>;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border card-shadow">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Team Performance Overview
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Today's performance of your team members
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Team Member</TableHead>
              <TableHead className="font-medium text-center">Total Visits Today</TableHead>
              <TableHead className="font-medium">Target Achieved</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-center">{member.totalVisitsToday}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={member.targetAchieved} 
                      className="h-2 flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {member.targetAchieved}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getPerformanceBadge(member.targetAchieved)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamPerformanceTable;
