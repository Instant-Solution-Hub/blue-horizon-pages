import { useState, useMemo, useEffect } from "react";
import { ClipboardList, CalendarIcon, User, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchFEsByManager } from "@/services/FEService";
import { fetchFEVisitReport } from "@/services/VisitService";


interface UserOption {
  id: number;
  name: string;
  employeeCode: string;
  territory: string;
}

const defaultVisitReport = {
  completedVisitCount: 0,
  missedVisitCount: 0,
  pendingVisitCount: 0,
  visits: [] as Visit[],
};

interface Visit {
  id: number;
  date: string;
  doctorName: string;
  hospitalName: string;
  visitType: "Doctor" | "Pharmacist" | "Stockist";
  status: "Completed" | "Missed" | "Pending";
  notes: string;
}


const statusVariant: Record<Visit["status"], string> = {
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Missed: "bg-red-100 text-red-700 border-red-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const ManagerVisitReports = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  // Draft (form) filter state - changes here do not filter until Apply is clicked
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // Applied filter state - actually used for filtering
  const [appliedFrom, setAppliedFrom] = useState<Date>();
  const [appliedTo, setAppliedTo] = useState<Date>();
  const [appliedStatus, setAppliedStatus] = useState<string>("all");
  const [appliedCategory, setAppliedCategory] = useState<string>("all");

  const [fieldExecutives, setFieldExecutives] = useState<any[]>([]);

useEffect(() => {
  const managerId = Number(sessionStorage.getItem("userID"));

  fetchFEsByManager(managerId)
    .then((res) => setFieldExecutives(res))
    .catch(() => setFieldExecutives([]));
}, []);

  const selectedUser = fieldExecutives.find((u) => u.id === selectedUserId);

  
const [visits, setVisits] = useState<Visit[]>([]);
const [visitReports, setVisitReports] = useState(defaultVisitReport);

const applyFilters = async () => {
  if (!selectedUserId || !fromDate || !toDate) return;

  try {
    const data = await fetchFEVisitReport(
      selectedUserId,
      format(fromDate, "yyyy-MM-dd"),
      format(toDate, "yyyy-MM-dd"),
      statusFilter === "all" ? null : statusFilter,
      categoryFilter === "all" ? null : categoryFilter
    );

    setVisitReports(data);
    setVisits(data.visits || []);
  } catch (err) {
    console.error(err);
    setVisitReports(defaultVisitReport);
    setVisits([]);
  }
};

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter("all");
    setCategoryFilter("all");
    setAppliedFrom(undefined);
    setAppliedTo(undefined);
    setAppliedStatus("all");
    setAppliedCategory("all");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Visit Reports</h1>
            </div>
            <p className="text-white/80 ml-14">View visit reports of Field Executives under you</p>
          </div>

          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-base">Select Field Executive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {fieldExecutives.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                       setSelectedUserId(user.id);
  setVisits([]);
  setVisitReports(defaultVisitReport);
  clearFilters();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      selectedUserId === user.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30 hover:bg-accent"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">{user.employeeCode}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.territory}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedUser && (
            <>
              <div className="animate-fade-in flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap" style={{ animationDelay: "0.15s" }}>
                <div className="space-y-1">
                  <Label className="text-sm">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="MISSED">Missed</SelectItem>
                      <SelectItem value="SCHEDULED">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="A_PLUS">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             <div className="flex gap-2">
  <Button onClick={applyFilters}>
    Apply
  </Button>

  {(fromDate || toDate || statusFilter !== "all" || categoryFilter !== "all") && (
    <Button variant="ghost" onClick={clearFilters}>
      Clear Filters
    </Button>
  )}
</div>
              </div>

              <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: "0.2s" }}>
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        <ClipboardList className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Visits</p>
                        <p className="text-3xl font-bold text-blue-700">{visits.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-emerald-700">{visitReports.completedVisitCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Missed</p>
                        <p className="text-3xl font-bold text-red-700">{visitReports.missedVisitCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-amber-100">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-amber-700">{visitReports.pendingVisitCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <CardHeader>
                  <CardTitle className="text-base">Visit Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {visits.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No visits found for the selected filters</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visits.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell className="whitespace-nowrap">{format(new Date(v.date), "dd MMM yyyy")}</TableCell>
                            <TableCell className="font-medium">{v.doctorName}</TableCell>
                            <TableCell>{v.hospitalName}</TableCell>
                            <TableCell><Badge variant="outline">{v.visitType}</Badge></TableCell>
                            <TableCell><Badge className={cn("border", statusVariant[v.status])} variant="outline">{v.status}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs">{v.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerVisitReports;
