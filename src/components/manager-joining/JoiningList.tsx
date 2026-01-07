import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, User, Building2, Calendar, FileText } from "lucide-react";

export interface JoiningRecord {
  id: string;
  doctorName: string;
  hospital: string;
  date: Date;
  scheduledTime: string;
  joiningTime: string;
  notes: string;
  status: "on-time" | "early" | "late";
}

interface JoiningListProps {
  joinings: JoiningRecord[];
}

const getStatusBadge = (status: JoiningRecord["status"]) => {
  switch (status) {
    case "on-time":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Time</Badge>;
    case "early":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Early</Badge>;
    case "late":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Late</Badge>;
  }
};

const JoiningList = ({ joinings }: JoiningListProps) => {
  if (joinings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No manager joinings recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {joinings.map((joining) => (
        <Card key={joining.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{joining.doctorName}</span>
                  {getStatusBadge(joining.status)}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{joining.hospital}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(joining.date, "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Scheduled: {joining.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Joined: {joining.joiningTime}</span>
                  </div>
                </div>

                {joining.notes && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <span>{joining.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JoiningList;
