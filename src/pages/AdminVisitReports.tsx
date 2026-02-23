import { useState, useMemo } from "react";
import { ClipboardList, Search, CalendarIcon, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type UserType = "field_executive" | "manager";

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

// Mock users
const fieldExecutives: UserOption[] = [
  { id: 1, name: "Arun Mehta", employeeCode: "FE001", territory: "North Region" },
  { id: 2, name: "Deepak Joshi", employeeCode: "FE002", territory: "South Region" },
  { id: 3, name: "Kavita Nair", employeeCode: "FE003", territory: "Central Region" },
  { id: 4, name: "Rahul Desai", employeeCode: "FE004", territory: "East Region" },
  { id: 5, name: "Sneha Gupta", employeeCode: "FE005", territory: "West Region" },
];

const managers: UserOption[] = [
  { id: 101, name: "Rajesh Kumar", employeeCode: "MGR001", territory: "North Zone" },
  { id: 102, name: "Priya Sharma", employeeCode: "MGR002", territory: "South Zone" },
  { id: 103, name: "Vikram Singh", employeeCode: "MGR003", territory: "Central Zone" },
];

// Mock visits
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
  101: [
    { id: 14, date: "2025-06-10", doctorName: "Dr. Harish Gupta", hospitalName: "AIIMS Delhi", visitType: "Doctor", status: "Completed", notes: "Zone review visit" },
    { id: 15, date: "2025-06-15", doctorName: "Dr. Sunita Reddy", hospitalName: "Medanta Hospital", visitType: "Doctor", status: "Completed", notes: "Team accompaniment" },
  ],
  102: [
    { id: 16, date: "2025-06-12", doctorName: "Dr. Lakshmi Nair", hospitalName: "CMC Vellore", visitType: "Doctor", status: "Completed", notes: "Strategy meeting" },
  ],
  103: [
    { id: 17, date: "2025-06-11", doctorName: "Dr. Sanjay Mishra", hospitalName: "Bhopal Memorial", visitType: "Doctor", status: "Completed", notes: "Market analysis" },
    { id: 18, date: "2025-06-18", doctorName: "Apollo Supply Chain", hospitalName: "Central Warehouse", visitType: "Stockist", status: "Completed", notes: "Quarterly stock check" },
  ],
};


const AdminVisitReports = () => {
  const [userType, setUserType] = useState<UserType>("field_executive");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const users = userType === "field_executive" ? fieldExecutives : managers;

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.employeeCode.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const filteredVisits = useMemo(() => {
    if (!selectedUserId) return [];
    const visits = allVisits[selectedUserId] || [];
    return visits.filter((v) => {
      const d = new Date(v.date);
      if (fromDate && d < fromDate) return false;
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }, [selectedUserId, fromDate, toDate]);

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setSelectedUserId(null);
    setUserSearch("");
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Visit Reports</h1>
            </div>
            <p className="text-white/80 ml-14">
              View visit reports of Field Executives and Managers
            </p>
          </div>

          {/* User Type Selector */}
          <div className="animate-fade-in flex gap-3">
            <Button
              variant={userType === "field_executive" ? "default" : "outline"}
              onClick={() => handleUserTypeChange("field_executive")}
              className="min-w-[160px]"
            >
              Field Executive
            </Button>
            <Button
              variant={userType === "manager" ? "default" : "outline"}
              onClick={() => handleUserTypeChange("manager")}
              className="min-w-[160px]"
            >
              Manager
            </Button>
          </div>

          {/* User List with Search */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-base">
                Select {userType === "field_executive" ? "Field Executive" : "Manager"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee code..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setFromDate(undefined);
                        setToDate(undefined);
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Date Pickers & Visit Table — only if user selected */}
          {selectedUser && (
            <>
              {/* Date Range */}
              <div className="animate-fade-in flex flex-col sm:flex-row items-start sm:items-end gap-3" style={{ animationDelay: "0.15s" }}>
                <div className="space-y-1">
                  <Label className="text-sm">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {(fromDate || toDate) && (
                  <Button variant="ghost" onClick={() => { setFromDate(undefined); setToDate(undefined); }}>
                    Clear Dates
                  </Button>
                )}
              </div>

              {/* Visit Summary Cards */}
              <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ animationDelay: "0.2s" }}>
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-emerald-100">
                        <ClipboardList className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed Visits</p>
                        <p className="text-3xl font-bold text-emerald-700">
                          {filteredVisits.filter((v) => v.status === "Completed").length}
                        </p>
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
                        <p className="text-sm text-muted-foreground">Missed Visits</p>
                        <p className="text-3xl font-bold text-red-700">
                          {filteredVisits.filter((v) => v.status === "Missed").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminVisitReports;
