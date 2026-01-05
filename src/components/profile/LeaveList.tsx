import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { format } from "date-fns";

export interface Leave {
  id: string;
  leaveType: string;
  status: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
}

interface LeaveListProps {
  leaves: Leave[];
}

const LeaveList = ({ leaves }: LeaveListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "SICK_LEAVE":
        return "Sick Leave";
      case "CASUAL_LEAVE":
        return "Casual Leave";
      case "EARNED_LEAVE":
        return "Earned Leave";
      default:
        return type;
    }
  };

  const calculateDays = (from: Date, to: Date) => {
    return differenceInDays(to, from) + 1;
  };

  if (leaves.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No leave applications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leaves.map((leave) => (
        <Card key={leave.id} className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">
                    {getLeaveTypeLabel(leave.leaveType)}
                  </h4>
                  <Badge
                    variant="outline"
                    className={getStatusColor(leave.status)}
                  >
                    {leave.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">From: </span>
                    <span className="font-medium">
                      {format(leave.fromDate, "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">To: </span>
                    <span className="font-medium">
                      {format(leave.toDate, "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="font-medium text-primary">
                      {calculateDays(leave.fromDate, leave.toDate)} day(s)
                    </span>
                  </div>
                </div>
                {leave.reason && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Reason: </span>
                    {leave.reason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaveList;
