import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, MapPin, Mail, Calendar, Eye } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  market: string;
  headquarters: string;
  email: string;
  todayVisitCount: number;
  targetProgress: number;
  onViewVisits: () => void;
}

const TeamMemberCard = ({
  name,
  market,
  headquarters,
  email,
  todayVisitCount,
  targetProgress,
  onViewVisits,
}: TeamMemberCardProps) => {
  return (
    <Card className="card-shadow hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar & Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>

          {/* Market & HQ */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground sm:w-40">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">{market}, {headquarters}</span>
          </div>

          {/* Today's Visits */}
          <div className="flex items-center gap-1.5 sm:w-28">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <span className="text-sm text-muted-foreground">Today: </span>
              <span className="font-semibold text-foreground">{todayVisitCount} visits</span>
            </div>
          </div>

          {/* Target Progress */}
          <div className="sm:w-36">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Target</span>
              <span className="text-xs font-medium text-foreground">{targetProgress}%</span>
            </div>
            <Progress value={targetProgress} className="h-2" />
          </div>

          {/* View Visits Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onViewVisits}
            className="flex items-center gap-1.5 sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            View Visits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
