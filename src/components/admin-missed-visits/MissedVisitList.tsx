import { useState } from "react";
import { Search, User, CheckCircle, Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MissedVisit {
  id: string;
  personName: string;
  employeeCode: string;
  doctorName: string;
  scheduledDate: Date;
  territory: string;
  reason: string;
  isCompleted: boolean;
  completionNotes?: string;
}

const mockFEVisits: MissedVisit[] = [
  { id: "fe1", personName: "Rahul Sharma", employeeCode: "FE-1001", doctorName: "Dr. Anita Desai", scheduledDate: new Date(2026, 1, 8), territory: "Mumbai North", reason: "Doctor unavailable", isCompleted: false },
  { id: "fe2", personName: "Priya Nair", employeeCode: "FE-1002", doctorName: "Dr. Suresh Patil", scheduledDate: new Date(2026, 1, 7), territory: "Pune West", reason: "Travel delay", isCompleted: false },
  { id: "fe3", personName: "Amit Kumar", employeeCode: "FE-1003", doctorName: "Dr. Kavita Joshi", scheduledDate: new Date(2026, 1, 6), territory: "Delhi South", reason: "Clinic closed", isCompleted: false },
  { id: "fe4", personName: "Rahul Sharma", employeeCode: "FE-1001", doctorName: "Dr. Manoj Gupta", scheduledDate: new Date(2026, 1, 5), territory: "Mumbai North", reason: "Emergency leave", isCompleted: true, completionNotes: "Visited next day" },
  { id: "fe5", personName: "Sneha Rao", employeeCode: "FE-1004", doctorName: "Dr. Ravi Mehta", scheduledDate: new Date(2026, 1, 4), territory: "Bangalore East", reason: "Scheduling conflict", isCompleted: false },
];

const mockManagerVisits: MissedVisit[] = [
  { id: "mg1", personName: "Vikram Singh", employeeCode: "MG-2001", doctorName: "Dr. Neha Agarwal", scheduledDate: new Date(2026, 1, 9), territory: "Gujarat Region", reason: "Meeting overrun", isCompleted: false },
  { id: "mg2", personName: "Meena Iyer", employeeCode: "MG-2002", doctorName: "Dr. Rakesh Verma", scheduledDate: new Date(2026, 1, 7), territory: "Kerala Region", reason: "Transport issue", isCompleted: false },
  { id: "mg3", personName: "Vikram Singh", employeeCode: "MG-2001", doctorName: "Dr. Pooja Shah", scheduledDate: new Date(2026, 1, 3), territory: "Gujarat Region", reason: "Doctor on leave", isCompleted: true, completionNotes: "Rescheduled and completed" },
];

export function MissedVisitList() {
  const [role, setRole] = useState<"fe" | "manager">("fe");
  const [searchQuery, setSearchQuery] = useState("");
  const [feVisits, setFEVisits] = useState(mockFEVisits);
  const [managerVisits, setManagerVisits] = useState(mockManagerVisits);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const { toast } = useToast();

  const visits = role === "fe" ? feVisits : managerVisits;

  const filtered = visits.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.personName.toLowerCase().includes(q) ||
      v.employeeCode.toLowerCase().includes(q)
    );
  });

  const pendingVisits = filtered.filter((v) => !v.isCompleted);
  const completedVisits = filtered.filter((v) => v.isCompleted);

  const handleMarkComplete = () => {
    if (!selectedVisitId || !completionNotes.trim()) return;

    const update = (list: MissedVisit[]) =>
      list.map((v) =>
        v.id === selectedVisitId
          ? { ...v, isCompleted: true, completionNotes: completionNotes.trim() }
          : v
      );

    if (role === "fe") setFEVisits(update);
    else setManagerVisits(update);

    toast({ title: "Visit marked as completed", description: "The missed visit has been updated." });
    setSelectedVisitId(null);
    setCompletionNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Role Toggle */}
      <Tabs value={role} onValueChange={(v) => { setRole(v as "fe" | "manager"); setSearchQuery(""); }}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="fe">Field Executives</TabsTrigger>
          <TabsTrigger value="manager">Managers</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or employee code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-background"
        />
      </div>

      {/* Pending */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          Pending Missed Visits
          <Badge variant="destructive">{pendingVisits.length}</Badge>
        </h3>
        {pendingVisits.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No pending missed visits</p>
        ) : (
          <div className="grid gap-3">
            {pendingVisits.map((visit) => (
              <VisitRow key={visit.id} visit={visit} onMarkComplete={() => setSelectedVisitId(visit.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          Completed
          <Badge variant="secondary">{completedVisits.length}</Badge>
        </h3>
        {completedVisits.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No completed visits yet</p>
        ) : (
          <div className="grid gap-3">
            {completedVisits.map((visit) => (
              <VisitRow key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </div>

      {/* Mark Complete Dialog */}
      <Dialog open={!!selectedVisitId} onOpenChange={(open) => { if (!open) { setSelectedVisitId(null); setCompletionNotes(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Visit as Completed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Completion Notes</label>
              <Textarea
                placeholder="Add notes about how the visit was completed..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedVisitId(null); setCompletionNotes(""); }}>
              Cancel
            </Button>
            <Button onClick={handleMarkComplete} disabled={!completionNotes.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VisitRow({ visit, onMarkComplete }: { visit: MissedVisit; onMarkComplete?: () => void }) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <User className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{visit.personName}</span>
          <Badge variant="secondary" className="text-xs">{visit.employeeCode}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Visit to <span className="font-medium text-foreground">{visit.doctorName}</span>
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{visit.scheduledDate.toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{visit.territory}</span>
        </div>
        <p className="text-xs text-destructive">Reason: {visit.reason}</p>
        {visit.isCompleted && visit.completionNotes && (
          <p className="text-xs text-muted-foreground italic">Notes: {visit.completionNotes}</p>
        )}
      </div>
      {visit.isCompleted ? (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 flex-shrink-0">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>
      ) : onMarkComplete ? (
        <Button size="sm" variant="outline" onClick={onMarkComplete} className="flex-shrink-0">
          <CheckCircle className="h-4 w-4 mr-1" /> Mark Complete
        </Button>
      ) : null}
    </Card>
  );
}
