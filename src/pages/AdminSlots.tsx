import { useState, useMemo } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarRange, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";
import { AdminSlotVisitList, AdminSlotVisit } from "@/components/admin-slots/AdminSlotVisitList";
import { WeekDaySelector } from "@/components/slot-planning/WeekDaySelector";
import { SlotRequestsModal, SlotRequest } from "@/components/admin-slots/SlotRequestsModal";

/* ---------- MOCK DATA ---------- */

const mockFieldExecutives: Person[] = [
  { id: 1, name: "Rahul Sharma", employeeCode: "FE001", territory: "North Delhi" },
  { id: 2, name: "Priya Patel", employeeCode: "FE002", territory: "South Mumbai" },
  { id: 3, name: "Amit Kumar", employeeCode: "FE003", territory: "East Kolkata" },
  { id: 4, name: "Sneha Reddy", employeeCode: "FE004", territory: "Hyderabad Central" },
];

const mockManagers: Person[] = [
  { id: 10, name: "Vikram Singh", employeeCode: "MGR001", territory: "North Zone" },
  { id: 11, name: "Anjali Mehta", employeeCode: "MGR002", territory: "West Zone" },
  { id: 12, name: "Suresh Nair", employeeCode: "MGR003", territory: "South Zone" },
];

const mockVisits: Record<string, AdminSlotVisit[]> = {
  "1-1-1": [
    { id: 1, type: "doctor", name: "Dr. John Smith", category: "A_PLUS", practiceType: "RP", designation: "Cardiologist", hospitalName: "City Hospital", visitTrack: "Visit 2/3" },
    { id: 2, type: "doctor", name: "Dr. Sarah Wilson", category: "A", practiceType: "OP", designation: "Pediatrician", hospitalName: "Metro Clinic", visitTrack: "Visit 1/2" },
    { id: 3, type: "pharmacist", name: "James Miller", hospitalName: "City Pharmacy", visitTrack: "Scheduled" },
  ],
  "1-1-2": [
    { id: 4, type: "doctor", name: "Dr. Mike Johnson", category: "B", practiceType: "NP", designation: "General", hospitalName: "Community Health", visitTrack: "Visit 1/1" },
    { id: 5, type: "pharmacist", name: "Lisa Anderson", hospitalName: "MedPlus", visitTrack: "Scheduled" },
  ],
  "10-1-1": [
    { id: 6, type: "doctor", name: "Dr. Neha Gupta", category: "A_PLUS", practiceType: "RP", designation: "Dermatologist", hospitalName: "Skin Care Clinic", visitTrack: "Visit 3/3" },
    { id: 7, type: "doctor", name: "Dr. Arjun Das", category: "A", practiceType: "OP", designation: "ENT", hospitalName: "Apollo Hospital", visitTrack: "Visit 1/2" },
  ],
};

const mockSlotRequests: SlotRequest[] = [
  {
    id: 1,
    requesterName: "Rahul Sharma",
    employeeCode: "FE001",
    role: "Field Executive",
    visitType: "Doctor",
    visitName: "Dr. John Smith",
    week: 2,
    day: 3,
    notes: "Doctor is unavailable on the scheduled day, requesting reschedule to next week.",
    status: "pending",
    requestedAt: "Feb 7, 2026 — 10:30 AM",
  },
  {
    id: 2,
    requesterName: "Vikram Singh",
    employeeCode: "MGR001",
    role: "Manager",
    visitType: "Pharmacist",
    visitName: "James Miller",
    week: 1,
    day: 5,
    notes: "Pharmacy closed for renovation, need to reschedule.",
    status: "pending",
    requestedAt: "Feb 6, 2026 — 3:15 PM",
  },
  {
    id: 3,
    requesterName: "Priya Patel",
    employeeCode: "FE002",
    role: "Field Executive",
    visitType: "Doctor",
    visitName: "Dr. Sarah Wilson",
    week: 1,
    day: 2,
    notes: "Conflicting visit schedule.",
    status: "approved",
    requestedAt: "Feb 4, 2026 — 9:00 AM",
  },
];

/* ---------- PAGE ---------- */

type SlotType = "field_executive" | "manager";

export default function AdminSlots() {
  const { toast } = useToast();
  const [slotType, setSlotType] = useState<SlotType | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [slotRequests, setSlotRequests] = useState<SlotRequest[]>(mockSlotRequests);

  const pendingCount = slotRequests.filter((r) => r.status === "pending").length;

  const handleApprove = (id: number) => {
    setSlotRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
    toast({ title: "Request Approved", description: "The slot update request has been approved." });
  };

  const handleReject = (id: number) => {
    setSlotRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
    toast({ title: "Request Rejected", description: "The slot update request has been rejected." });
  };

  const persons = slotType === "field_executive" ? mockFieldExecutives : slotType === "manager" ? mockManagers : [];

  const selectedPerson = useMemo(
    () => persons.find((p) => p.id === selectedPersonId) ?? null,
    [persons, selectedPersonId]
  );

  const visitKey = selectedPersonId ? `${selectedPersonId}-${selectedWeek}-${selectedDay}` : "";
  const allVisits = mockVisits[visitKey] ?? [];
  const doctorVisits = allVisits.filter((v) => v.type === "doctor");
  const pharmacistVisits = allVisits.filter((v) => v.type === "pharmacist");

  const handleTypeChange = (type: SlotType) => {
    setSlotType(type);
    setSelectedPersonId(null);
    setSelectedWeek(1);
    setSelectedDay(1);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-white/20 rounded-xl">
                      <CalendarRange className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Slots</h1>
                  </div>
                  <p className="text-white/80 ml-14">
                    View planned slot schedules for Field Executives and Managers
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsRequestsOpen(true)}
                  className="relative"
                >
                  <Inbox className="h-4 w-4 mr-2" />
                  Requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Step 1 — Select Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Slot Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={slotType === "field_executive" ? "default" : "outline"}
                    onClick={() => handleTypeChange("field_executive")}
                  >
                    Field Executive
                  </Button>
                  <Button
                    variant={slotType === "manager" ? "default" : "outline"}
                    onClick={() => handleTypeChange("manager")}
                  >
                    Manager
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 — Select Person */}
            {slotType && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-base">
                    Select {slotType === "field_executive" ? "Field Executive" : "Manager"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonSelector
                    persons={persons}
                    selectedPersonId={selectedPersonId}
                    onSelect={setSelectedPersonId}
                    placeholder={`Search ${slotType === "field_executive" ? "Field Executive" : "Manager"} by name or employee ID...`}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3 — Week & Day + Visits */}
            {selectedPerson && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-base">
                    Slot Schedule — {selectedPerson.name}
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                      ({selectedPerson.employeeCode})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <WeekDaySelector
                    selectedWeek={selectedWeek}
                    selectedDay={selectedDay}
                    onWeekChange={setSelectedWeek}
                    onDayChange={setSelectedDay}
                  />

                  <AdminSlotVisitList
                    doctorVisits={doctorVisits}
                    pharmacistVisits={pharmacistVisits}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <SlotRequestsModal
        open={isRequestsOpen}
        onOpenChange={setIsRequestsOpen}
        requests={slotRequests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
