import { useState, useMemo, useEffect } from "react";
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
import { fetchFEs } from "@/services/FEService";
import { fetchManagerInfos } from "@/services/ManagerService";
import { set } from "date-fns";
import { fetchFEVisitsByWeekDay, fetchManagerVisitsByWeekDay } from "@/services/AdminSlotService";
import { AdminSlotVisitListManager } from "@/components/admin-slots/AdminSlotVisitListManager";
import { getAllPendingRequests, reviewSlotChangeRequest } from "@/services/SlotRequestService";

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


/* ---------- PAGE ---------- */

type SlotType = "field_executive" | "manager";

export default function AdminSlots() {
  const { toast } = useToast();
  const [slotType, setSlotType] = useState<SlotType | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [slotRequests, setSlotRequests] = useState<SlotRequest[]>([]);
  const [fieldExecutives, setFieldExecutives] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [managerVisits, setManagerVisits] = useState<any[]>([]);
  const [feDoctorVisits, setFEDoctorVisits] = useState<any[]>([]);
  const [fePharmacistVisits, setFEPharmacistVisits] = useState<any[]>([]);
  const { currentWeek, currentDay } = getCurrentWeekAndDay();
  const userId = sessionStorage.getItem("userID");


  useEffect(() => {
    fetchAllFieldExecutives();
    fetchAllManagers();
    fetchAllPendingSlotRequests();

  }, []);

  useEffect(() => {
    console.log("Selected Type:", slotType);
    if (slotType === "field_executive" && selectedPersonId) {
      fetchFEVisits(selectedPersonId, selectedWeek, selectedDay);
    } else if (slotType === "manager" && selectedPersonId) {
      fetchManagerVisits(selectedPersonId, selectedWeek, selectedDay);
    }
  }, [selectedDay, selectedWeek, selectedPersonId]);

  const fetchAllFieldExecutives = async () => {
    const response = await fetchFEs();
    console.log("Fetched Field Executives: ", response);
    setFieldExecutives(response);
    // You can set the fetched data to state here if needed
  };

  const fetchAllManagers = async () => {
    const response = await fetchManagerInfos();
    setManagers(response);
    console.log("Fetched Managers: ", response);
  };

  const fetchManagerVisits = async (managerId: number, week: number, day: number) => {
    console.log(`Fetching visits for Manager ID: ${managerId}, Week: ${week}, Day: ${day}`);
    const response = await fetchManagerVisitsByWeekDay(managerId, week, day);
    setManagerVisits(response);
  };

  const fetchFEVisits = async (feId: number, week: number, day: number) => {
    console.log(`Fetching visits for Field Executive ID: ${feId}, Week: ${week}, Day: ${day}`);
    const response = await fetchFEVisitsByWeekDay(feId, week, day);
    let doctorVisits = response.filter((visit: any) => visit.visitType.toLowerCase() === "doctor");
    let pharmacistVisits = response.filter((visit: any) => visit.visitType.toLowerCase() === "pharmacist");
    setFEPharmacistVisits(pharmacistVisits);
    setFEDoctorVisits(doctorVisits);
  };

  const fetchAllPendingSlotRequests = async () => {
    const response = await getAllPendingRequests();
    console.log("Fetched Slot Change Requests: ", response);
    setSlotRequests(response);
  }

  const pendingCount = slotRequests.filter((r) => r.status.toLowerCase() === "pending").length;

  const handleApprove = async (requestId: number) => {
    let obj = {
      "action": "approve",
      "notes": "Approved by admin"
    }
    try {
      const response = await reviewSlotChangeRequest(requestId, Number(userId), obj);
      setSlotRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "approved" } : r
        )
      );
      fetchAllPendingSlotRequests();
      toast({ title: "Request Approved", description: "The slot update request has been approved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve the slot update request." });
    }
  };

  const handleReject = async (requestId: number) => {
    let obj = {
      "action": "reject",
      "notes": "Rejected by admin"
    }
    try {
      const response = await reviewSlotChangeRequest(requestId, Number(userId), obj);
       setSlotRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" } : r
        )
      );
      toast({ title: "Request Rejected", description: "The slot update request has been rejected." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject the slot update request." });
    }

    toast({ title: "Request Rejected", description: "The slot update request has been rejected." });
  };

  const persons = slotType === "field_executive" ? fieldExecutives : slotType === "manager" ? managers : [];

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

  function getCurrentWeekAndDay() {
    const today = new Date();

    // Day of week: Mon = 1, Sun = 7
    const jsDay = today.getDay(); // 0 = Sun
    const currentDay = jsDay === 0 ? 7 : jsDay;

    // Week of month (1–4/5)
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).getDay();

    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const currentWeek = Math.ceil((today.getDate() + offset) / 7);

    return { currentWeek, currentDay };
  }


  return (
    <div className="h-screen bg-background flex overflow-hidden">
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
                    isPastDisabled={false}
                    currentWeek={currentWeek}
                    currentDay={currentDay}
                  />
                  {slotType === "manager" ? (
                    <AdminSlotVisitListManager doctorVisits={managerVisits} pharmacistVisits={[]} />
                  ) : (

                    <AdminSlotVisitList doctorVisits={feDoctorVisits} pharmacistVisits={fePharmacistVisits} />
                  )}
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
