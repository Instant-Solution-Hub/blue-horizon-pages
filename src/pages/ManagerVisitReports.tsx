import { useState, useMemo } from "react";
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

interface UserOption {
  id: number;
  name: string;
  employeeCode: string;
  territory: string;
}

interface Visit {
  id: number;
  date: string;
  doctorName: string;
  hospitalName: string;
  visitType: "Doctor" | "Pharmacist" | "Stockist";
  status: "Completed" | "Missed" | "Pending";
  notes: string;
}

const fieldExecutives: UserOption[] = [
  { id: 1, name: "Arun Mehta", employeeCode: "FE001", territory: "North Region" },
  { id: 2, name: "Deepak Joshi", employeeCode: "FE002", territory: "South Region" },
  { id: 3, name: "Kavita Nair", employeeCode: "FE003", territory: "Central Region" },
  { id: 4, name: "Rahul Desai", employeeCode: "FE004", territory: "East Region" },
  { id: 5, name: "Sneha Gupta", employeeCode: "FE005", territory: "West Region" },
];

const allVisits: Record<number, Visit[]> = {
  1: [
    { id: 1, date: "2025-06-10", doctorName: "Dr. Ramesh Patel", hospitalName: "City Hospital", visitType: "Doctor", status: "Completed", notes: "Discussed new product line" },
    { id: 2, date: "2025-06-12", doctorName: "Dr. Meena Iyer", hospitalName: "Apollo Clinic", visitType: "Doctor", status: "Completed", notes: "Sample distributed" },
    { id: 3, date: "2025-06-14", doctorName: "MedPlus Pharmacy", hospitalName: "MedPlus Store #12", visitType: "Pharmacist", status: "Missed", notes: "Shop closed" },
    { id: 4, date: "2025-06-18", doctorName: "HealthCare Traders", hospitalName: "Main Market", visitType: "Stockist", status: "Completed", notes: "Order placed ₹45,000" },
    { id: 5, date: "2025-06-22", doctorName: "Dr. Suresh Nair", hospitalName: "Global Hospital", visitType: "Doctor", status: "Completed", notes: "Follow-up visit" },
  ],
  2: [
    { id: 6, date: "2025-06-11", doctorName: "Dr. Anita Rao", hospitalName: "Fortis Hospital", visitType: "Doctor", status: "Completed", notes: "New prescription started" },
    { id: 7, date: "2025-06-13", doctorName: "PharmaCare Agency", hospitalName: "PharmaCare Office", visitType: "Stockist", status: "Completed", notes: "Stock replenished" },
    { id: 8, date: "2025-06-15", doctorName: "Dr. Kiran Das", hospitalName: "Max Hospital", visitType: "Doctor", status: "Missed", notes: "Doctor unavailable" },
  ],
  3: [
    { id: 9, date: "2025-06-09", doctorName: "Dr. Pooja Verma", hospitalName: "Narayana Health", visitType: "Doctor", status: "Completed", notes: "Product demo done" },
    { id: 10, date: "2025-06-16", doctorName: "LifeLine Distributors", hospitalName: "Warehouse #3", visitType: "Stockist", status: "Completed", notes: "Monthly review" },
  ],
  4: [
    { id: 11, date: "2025-06-08", doctorName: "Dr. Amit Shah", hospitalName: "Ruby Hall Clinic", visitType: "Doctor", status: "Completed", notes: "Positive feedback on Larimar-500" },
    { id: 12, date: "2025-06-14", doctorName: "Dr. Neha Kapoor", hospitalName: "Sahyadri Hospital", visitType: "Doctor", status: "Pending", notes: "Scheduled follow-up" },
  ],
  5: [
    { id: 13, date: "2025-06-10", doctorName: "Dr. Ravi Menon", hospitalName: "Kokilaben Hospital", visitType: "Doctor", status: "Completed", notes: "Conversion achieved" },
  ],
};

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

  const selectedUser = fieldExecutives.find((u) => u.id === selectedUserId);

  const dateFilteredVisits = useMemo(() => {
    if (!selectedUserId) return [];
    const visits = allVisits[selectedUserId] || [];
    return visits.filter((v) => {
      const d = new Date(v.date);
      if (appliedFrom && d < appliedFrom) return false;
      if (appliedTo) {
        const end = new Date(appliedTo);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }, [selectedUserId, appliedFrom, appliedTo]);

  const filteredVisits = useMemo(() => {
    return dateFilteredVisits.filter((v) => {
      if (appliedStatus !== "all" && v.status !== appliedStatus) return false;
      if (appliedCategory !== "all" && v.visitType !== appliedCategory) return false;
      return true;
    });
  }, [dateFilteredVisits, appliedStatus, appliedCategory]);

  const totals = useMemo(() => ({
    total: dateFilteredVisits.length,
    completed: dateFilteredVisits.filter((v) => v.status === "Completed").length,
    missed: dateFilteredVisits.filter((v) => v.status === "Missed").length,
    pending: dateFilteredVisits.filter((v) => v.status === "Pending").length,
  }), [dateFilteredVisits]);

  const applyFilters = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setAppliedStatus(statusFilter);
    setAppliedCategory(categoryFilter);
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
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Missed">Missed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="Stockist">Stockist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(fromDate || toDate || statusFilter !== "all" || categoryFilter !== "all") && (
                  <Button variant="ghost" onClick={() => { setFromDate(undefined); setToDate(undefined); setStatusFilter("all"); setCategoryFilter("all"); }}>
                    Clear Filters
                  </Button>
                )}
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
                        <p className="text-3xl font-bold text-blue-700">{totals.total}</p>
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
                        <p className="text-3xl font-bold text-emerald-700">{totals.completed}</p>
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
                        <p className="text-3xl font-bold text-red-700">{totals.missed}</p>
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
                        <p className="text-3xl font-bold text-amber-700">{totals.pending}</p>
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
                  {filteredVisits.length === 0 ? (
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
                        {filteredVisits.map((v) => (
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
