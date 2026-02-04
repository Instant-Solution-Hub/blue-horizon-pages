import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
// Added UserCheck to imports
import { Clock, User, Building2, Calendar, FileText, Users, UserCheck } from "lucide-react"; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface ManagerJoiningRecord {
  id: number;
  feName: string;
  feId: number;
  doctorName: string;
  hospital: string;
  date: string;
  scheduledTime: string;
  joiningTime: string;
  notes: string;
  managerName?: string;
  status: "ON_TIME" | "EARLY" | "LATE";
}

interface ManagerJoiningViewProps {
  joinings: ManagerJoiningRecord[];
}

const getStatusBadge = (status: ManagerJoiningRecord["status"]) => {
  switch (status) {
    case "ON_TIME":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Time</Badge>;
    case "EARLY":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Early</Badge>;
    case "LATE":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Late</Badge>;
  }
};

const ManagerJoiningView = ({ joinings }: ManagerJoiningViewProps) => {
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
  }, {} as Record<string, { feName: string; feId: number; joinings: ManagerJoiningRecord[] }>);

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
    <Accordion type="multiple" defaultValue={feGroups.map(g => g.feId.toString())} className="space-y-3">
      {feGroups.map((group) => (
        <AccordionItem key={group.feId} value={group.feId.toString()} className="border rounded-lg bg-card">
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
                        {/* Row 1: Doctor & Status */}
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-lg">{joining.doctorName}</span>
                          {getStatusBadge(joining.status)}
                        </div>

                        {/* Row 2: Manager (Conditional) - ADDED HERE */}
                        {joining.managerName && (
                          <div className="flex items-center gap-2 text-sm bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Accompanied by:</span>
                            <span className="font-medium text-slate-700">{joining.managerName}</span>
                          </div>
                        )}

                        {/* Row 3: Hospital */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{joining.hospital}</span>
                        </div>

                        {/* Row 4: Dates & Times */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(parseISO(joining.joiningTime), "dd MMM yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Scheduled: {format(parseISO(joining.scheduledTime), "hh:mm a")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Joined: {format(parseISO(joining.joiningTime), "hh:mm a")}</span>
                          </div>
                        </div>

                        {/* Row 5: Notes */}
                        {joining.notes && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                            <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="italic">{joining.notes}</span>
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