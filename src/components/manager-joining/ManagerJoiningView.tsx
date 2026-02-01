import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, User, Building2, Calendar, FileText, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface ManagerJoiningRecord {
  id: string;
  feName: string;
  feId: string;
  doctorName: string;
  hospital: string;
  date: Date;
  scheduledTime: string;
  joiningTime: string;
  notes: string;
  status: "on-time" | "early" | "late";
}

interface ManagerJoiningViewProps {
  joinings: ManagerJoiningRecord[];
}

const getStatusBadge = (status: ManagerJoiningRecord["status"]) => {
  switch (status) {
    case "on-time":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Time</Badge>;
    case "early":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Early</Badge>;
    case "late":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Late</Badge>;
  }
};

const ManagerJoiningView = ({ joinings }: ManagerJoiningViewProps) => {
  // Group joinings by Field Executive
  const groupedByFE = joinings.reduce((acc, joining) => {
    if (!acc[joining.feId]) {
      acc[joining.feId] = {
        feName: joining.feName,
        feId: joining.feId,
        joinings: [],
      };
    }
    acc[joining.feId].joinings.push(joining);
    return acc;
  }, {} as Record<string, { feName: string; feId: string; joinings: ManagerJoiningRecord[] }>);

  const feGroups = Object.values(groupedByFE);

  if (feGroups.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No manager joinings recorded for this month.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={feGroups.map(g => g.feId)} className="space-y-3">
      {feGroups.map((group) => (
        <AccordionItem key={group.feId} value={group.feId} className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{group.feName}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.joinings.length} joining{group.joinings.length !== 1 ? "s" : ""} this month
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 mt-2">
              {group.joinings.map((joining) => (
                <Card key={joining.id} className="border-l-4 border-l-primary/50">
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

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ManagerJoiningView;
