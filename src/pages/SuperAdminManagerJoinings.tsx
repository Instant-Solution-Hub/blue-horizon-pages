import { useState, useMemo, useEffect } from "react";
import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  Users,
  User,
  Building2,
  Clock,
  Calendar,
  FileText,
  UserCircle,
  CalendarIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { fetchManagerJoiningsByDateRange } from "@/services/ManagerJoiningService";

export interface JoiningRecord {
  id: number;
  managerId: string;
  managerName: string;
  feId: string;
  feName: string;
  doctorName: string;
  hospital: string;
  date: Date;
  scheduledTime: string;
  joiningTime: string;
  notes: string;
  status: "on-time" | "early" | "late";
}

// Mock data: manager joinings recorded by FEs (current month)
const MOCK_JOININGS: JoiningRecord[] = [];

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

const getCurrentMonthRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  end.setHours(23, 59, 59, 999);

  return { start, end };
};



const SuperAdminManagerJoinings = () => {
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [selectedFeId, setSelectedFeId] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [joinings, setJoinings] = useState<JoiningRecord[]>([]);
const [loading, setLoading] = useState(false);

  const currentMonth = format(new Date(), "MMMM yyyy");

  const loadData = async (from: Date, to: Date) => {
  try {
    setLoading(true);
    const data = await fetchManagerJoiningsByDateRange(from, to);
    setJoinings(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const { start, end } = getCurrentMonthRange();
  loadData(start, end);
}, []);

useEffect(() => {
  if (!fromDate || !toDate) return;

  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);

  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  loadData(from, to);
}, [fromDate, toDate]);


  const filteredJoinings = useMemo(() => {
  return joinings.map((j) => ({
    ...j,
    date: new Date(j.date),
  }));
}, [joinings]);

  const managers = useMemo(() => {
    const map = new Map<string, { managerId: string; managerName: string; count: number; feCount: number }>();
    filteredJoinings.forEach((j) => {
      const existing = map.get(j.managerId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(j.managerId, { managerId: j.managerId, managerName: j.managerName, count: 1, feCount: 0 });
      }
    });
    map.forEach((m) => {
      m.feCount = new Set(
        filteredJoinings.filter((j) => j.managerId === m.managerId).map((j) => j.feId)
      ).size;
    });
    return Array.from(map.values());
  }, [filteredJoinings]);

  const fesUnderManager = useMemo(() => {
    if (!selectedManagerId) return [];
    const map = new Map<string, { feId: string; feName: string; count: number }>();
    filteredJoinings.filter((j) => j.managerId === selectedManagerId).forEach((j) => {
      const existing = map.get(j.feId);
      if (existing) existing.count += 1;
      else map.set(j.feId, { feId: j.feId, feName: j.feName, count: 1 });
    });
    return Array.from(map.values());
  }, [selectedManagerId, filteredJoinings]);

  const joiningsForFe = useMemo(() => {
    if (!selectedManagerId || !selectedFeId) return [];
    return filteredJoinings.filter(
      (j) => j.managerId === selectedManagerId && j.feId === selectedFeId
    );
  }, [selectedManagerId, selectedFeId, filteredJoinings]);


  const selectedManager = managers.find((m) => m.managerId === selectedManagerId);
  const selectedFe = fesUnderManager.find((f) => f.feId === selectedFeId);

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header / Breadcrumb */}
          <div>
            <h1 className="text-2xl font-bold">Manager Joinings</h1>
            <p className="text-muted-foreground">
              All manager joinings recorded by Field Executives for {currentMonth}
            </p>
          </div>

          {/* Date filter */}
          <Card>
            <CardContent className="p-4 flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      disabled={(date) => (fromDate ? date < fromDate : false)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(fromDate || toDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFromDate(undefined);
                    setToDate(undefined);
                     const { start, end } = getCurrentMonthRange();
                     loadData(start, end); // ✅ reload current month
                   
                  }}
                  className="gap-1"
                >
                  <X className="w-4 h-4" /> Clear
                </Button>
              )}
            </CardContent>
          </Card>


          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              className={`hover:underline ${!selectedManagerId ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              onClick={() => {
                setSelectedManagerId(null);
                setSelectedFeId(null);
              }}
            >
              Managers
            </button>
            {selectedManager && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <button
                  className={`hover:underline ${!selectedFeId ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  onClick={() => setSelectedFeId(null)}
                >
                  {selectedManager.managerName}
                </button>
              </>
            )}
            {selectedFe && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{selectedFe.feName}</span>
              </>
            )}
          </div>

          {/* Step 1: Manager list */}
          {!selectedManagerId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {managers.map((m) => (
                <Card
                  key={m.managerId}
                  className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
                  onClick={() => setSelectedManagerId(m.managerId)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{m.managerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {m.feCount} FE{m.feCount !== 1 ? "s" : ""} • {m.count} joining{m.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
              {managers.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No manager joinings recorded this month.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: FEs under selected manager */}
          {selectedManagerId && !selectedFeId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedManagerId(null)}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Managers
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fesUnderManager.map((fe) => (
                  <Card
                    key={fe.feId}
                    className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
                    onClick={() => setSelectedFeId(fe.feId)}
                  >
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{fe.feName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {fe.count} joining{fe.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Joinings for selected FE */}
          {selectedManagerId && selectedFeId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFeId(null)}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to FEs
              </Button>
              <div className="space-y-3">
                {joiningsForFe.map((joining) => (
                  <Card key={joining.id} className="border-l-4 border-l-primary/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
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
                    </CardContent>
                  </Card>
                ))}
                {joiningsForFe.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No joinings recorded by this FE this month.
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminManagerJoinings;
