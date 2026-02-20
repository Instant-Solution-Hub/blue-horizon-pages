import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { MonthlyTargetProgress } from "@/components/slot-planning/MonthlyTargetProgress";
import { WarningSection } from "@/components/slot-planning/WarningSection";
import { WeekDaySelector } from "@/components/slot-planning/WeekDaySelector";
import { SlotTable, SlotVisit } from "@/components/slot-planning/SlotTable";
import { SlotCard } from "@/components/slot-planning/SlotCard";
import { AddSlotModal } from "@/components/slot-planning/AddSlotModal";
import { RequestUpdateModal } from "@/components/slot-planning/RequestUpdateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteVisitById, fetchPlannedDoctorVisits, fetchPlannedPharmacyVisits, planVisit } from "@/services/VisitService";
import { set } from "date-fns";
import { PharmacistSlotCard } from "@/components/slot-planning/PharmacistSlotCard";
import { PharmacistSlotTable } from "@/components/slot-planning/PharmicistSlotTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { slotChangeRequest } from "@/services/SlotRequestService";

/* ---------------- MOCK DATA ---------------- */

// const mockDoctorVisits: SlotVisit[] = [
//   {
//     id: 1,
//     type: "doctor",
//     name: "Dr. John Smith",
//     category: "A_PLUS",
//     practiceType: "RP",
//     designation: "Cardiologist",
//     hospitalName: "City Hospital",
//     visitTrack: "Visit 3/3",
//   },
//   {
//     id: 2,
//     type: "doctor",
//     name: "Dr. Sarah Wilson",
//     category: "A",
//     practiceType: "OP",
//     designation: "Pediatrician",
//     hospitalName: "Metro Clinic",
//     visitTrack: "Visit 1/2",
//   },
//   {
//     id: 3,
//     type: "doctor",
//     name: "Dr. Mike Johnson",
//     category: "B",
//     practiceType: "NP",
//     designation: "General",
//     hospitalName: "Community Health",
//     visitTrack: "Visit 1/1",
//   },
// ];

// const mockPharmacistVisits: SlotVisit[] = [
//   {
//     id: 4,
//     type: "pharmacist",
//     name: "James Miller",
//     hospitalName: "City Pharmacy",
//     visitTrack: "Scheduled",
//   },
//   {
//     id: 5,
//     type: "pharmacist",
//     name: "Lisa Anderson",
//     hospitalName: "MedPlus",
//     visitTrack: "Scheduled",
//   },
// ];

/* ---------------- PAGE ---------------- */

export default function SlotPlanning() {
  const { toast } = useToast();
  const { currentWeek, currentDay } = getCurrentWeekAndDay();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [doctorSlots, setDoctorSlots] = useState<any[]>([]);
  const [pharmacistSlots, setPharmacistSlots] = useState<any[]>([]);

  // const [slots, setSlots] = useState<SlotVisit[]>([
  //   ...mockDoctorVisits,
  //   ...mockPharmacistVisits,
  // ]);

  const feID = parseInt(sessionStorage.getItem("feID") || "0");

  useEffect(() => {
    getPlannedDoctorVisits();
    getPlannedPharmacyVisits();
  }, [selectedWeek, selectedDay]);

  const getPlannedDoctorVisits = async () => {
    const response = await fetchPlannedDoctorVisits(feID, selectedWeek, selectedDay.toString());
    setDoctorSlots(response);
  };

  const getPlannedPharmacyVisits = async () => {
    const response = await fetchPlannedPharmacyVisits(feID, selectedWeek, selectedDay.toString());
    setPharmacistSlots(response);
  };

  /* ---------------- DATE HELPERS ---------------- */

  const today = new Date();
  // const isFirstOfMonth = today.getDate() === 2;
  const isFirstOfMonth = true;

  const currentMonthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleAddSlot = async (slot: {
    type: "doctor" | "pharmacist";
    id: number;
    week: number;
    day: number;
    pharmacist?: any;
  }) => {

    try {
      let obj = {
        "fieldExecutiveId": parseInt(sessionStorage.getItem("feID") || "0"),
        "doctorId": slot.type == "doctor" ? slot.id : null,
        "pharmacistId": slot.type == "pharmacist" ? slot.id : null,
        "weekNumber": slot.week,
        "dayOfWeek": slot.day,
        "visitType": slot.type === "doctor" ? "DOCTOR" : "PHARMACIST",
        "pharmacyName": slot.pharmacist?.pharmacyName || "",
        "contactPerson": slot.pharmacist?.contactPerson || "",
        "contactNumber": slot.pharmacist?.contactNumber || "",
        "stockistType": "NONE",
        "stockistName": ""
      }
      let response = await planVisit(obj);
      console.log("Plan Visit Response: ", response);
      getPlannedDoctorVisits();
      getPlannedPharmacyVisits();
      toast({
        title: "Slot Added",
        description: `${slot.type === "doctor" ? "Doctor" : "Pharmacist"
          } visit scheduled for Week ${slot.week}, Day ${slot.day}`,
      });
    } catch (error) {
      console.log("Error in adding slot: ", error);
      toast({
        title: "Failed to Add Slot",
        description: error.response.data.message,
        variant: "destructive",
      });

    }


  };

  const handleDeleteSlot = async (id: number) => {
    console.log("Deleting Slot with id: ", id);
    try {
      const response = await deleteVisitById(id);
      console.log("Delete Visit Response: ", response);
      getPlannedDoctorVisits();
      getPlannedPharmacyVisits();
      toast({
        title: "Slot Removed",
        description: "The visit has been removed from your schedule.",
      });
    } catch (error) {
      toast({
        title: "Failed to Remove Slot",
        description: "The visit could not be removed from your schedule.",
        variant: "destructive",
      });
    }

  };

  /**
   * 🔥 UPDATED: single visit instead of array
   */
  const handleRequestUpdate = async (data: {
    visitType: string;
    visitId: number;
    selectedWeek: number;
    selectedDay: number;
    notes: string;
  }) => {
    console.log("Requesting update with data: ", data);
    let obj = {
      "visitId": data.visitId,
      "userId": parseInt(sessionStorage.getItem("feID") || "0"),
      "managerVisitId": 0,
      "requestedWeekNumber": data.selectedWeek,
      "requestedDayOfWeek": data.selectedDay,
      "reason": data.notes,
      "userType": "field_executive"
    }
    try {
      const response = await slotChangeRequest(obj);
      toast({
        title: "Request Sent",
        description: `Your slot update request for the selected ${data.visitType} visit has been sent to your admin for approval.`,
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: `Your slot update request for the selected ${data.visitType} visit could not be sent.`,
      });
    }

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


  /* ---------------- FILTERS ---------------- */

  // const doctorSlots = slots.filter((s) => s.type === "doctor");
  // const pharmacistSlots = slots.filter((s) => s.type === "pharmacist");

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Slot Planning</h1>
              <p className="text-muted-foreground">{currentMonthName}</p>
            </div>
            {!isFirstOfMonth && <MonthlyTargetProgress />}
            <WarningSection isFirstOfMonth={isFirstOfMonth} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Monthly Slot Planning</CardTitle>

                {!isFirstOfMonth && (
                  <Button
                    variant="outline"
                    onClick={() => setIsRequestModalOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Request Slot Update
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <WeekDaySelector
                  selectedWeek={selectedWeek}
                  selectedDay={selectedDay}
                  currentWeek={currentWeek}
                  currentDay={currentDay}
                  // currentMonth={new Date().getMonth()+1}
                  isPastDisabled={false}
                  onWeekChange={setSelectedWeek}
                  onDayChange={setSelectedDay}
                />

                {isFirstOfMonth ? (
                  <>
                    {!(selectedWeek == 1 && selectedDay == 2) ? (<Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Slot
                    </Button>) : (<Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <AlertTitle className="text-amber-700 font-semibold">Slot Planning Notice</AlertTitle>
                      <AlertDescription className="text-amber-600">
                        Slot planning for Week 1, Day 2 is locked. Since it's the day for planning slots.
                      </AlertDescription>
                    </Alert>)}


                    {/* Doctor Slots */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                        Doctor Visits ({doctorSlots.length})
                      </h3>

                      {doctorSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center border rounded-lg py-4">
                          No doctor visits scheduled
                        </p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {doctorSlots.map((slot) => (
                            <SlotCard
                              key={slot.visitId}
                              {...slot}
                              canDelete
                              onDelete={() => handleDeleteSlot(slot.visitId)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pharmacist Slots */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                        Pharmacist Visits ({pharmacistSlots.length})
                      </h3>

                      {pharmacistSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center border rounded-lg py-4">
                          No pharmacist visits scheduled
                        </p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {pharmacistSlots.map((slot) => (
                            <PharmacistSlotCard
                              key={slot.visitId}
                              {...slot}
                              canDelete
                              onDelete={() => handleDeleteSlot(slot.visitId)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <SlotTable title="Doctor Visits" visits={doctorSlots} />
                    <PharmacistSlotTable
                      title="Pharmacist Visits"
                      visits={pharmacistSlots}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <AddSlotModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        onAddSlot={handleAddSlot}
      />

      <RequestUpdateModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        doctorVisits={doctorSlots.map((s) => ({
          id: s.visitId,
          name: s.doctorName,
          type: "doctor",
        }))}
        pharmacistVisits={pharmacistSlots.map((s) => ({
          id: s.visitId,
          name: s.pharmacyName,
          type: "pharmacist",
        }))}
        onSubmit={handleRequestUpdate}
      />
    </div>
  );
}
