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
import { deleteVisitById, fetchCurrentPlannedDoctorVisits, fetchCurrentPlannedPharmacyVisits, fetchPlannedDoctorVisits, fetchPlannedPharmacyVisits, planCurrentMonthVisit, planVisit } from "@/services/VisitService";
import { set } from "date-fns";
import { PharmacistSlotCard } from "@/components/slot-planning/PharmacistSlotCard";
import { PharmacistSlotTable } from "@/components/slot-planning/PharmicistSlotTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkIfSlotPlanDayEnabled, slotChangeRequest, slotPlanDayRequestFieldExecutive } from "@/services/SlotRequestService";
import { SlotPlanDayRequestModal } from "@/components/slot-planning/SlotPlanDayRequestModal";
export const holidayList = [
  "2026-04-15", // VISHU
  "2026-05-01", // LABOUR DAY
  "2026-05-27", // BAKRID
  "2026-06-25", // MUHARRAM
  "2026-08-12", // KARKIDAKAVAVU
  "2026-08-15", // INDEPENDENCE DAY
  "2026-08-25", // ONAM
  "2026-08-26", // ONAM
  "2026-10-21", // VIJAYADHASHAMI
  "2026-12-25", // CHRISTMAS
  "2027-01-26", // REPUBLIC DAY
  "2027-03-06", // SHIVARATHRI
  "2027-03-10"  // RAMZAN
];
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

  const getFirstDayOfMonth = (isFirstOfMonth) => {
    const today = new Date();

    // Decide month
    const month = isFirstOfMonth
      ? today.getMonth() + 1   // next month
      : today.getMonth();      // current month

    const year = today.getFullYear();

    const date = new Date(year, month, 1);

    let day = date.getDay(); // 0 (Sun) → 6 (Sat)

    // Convert to 1–7 (Sun–Sat)
    return day === 0 ? 1 : day + 1;
  };
  const [slotPlanDayEnabled, setSlotPlanDayEnabled] = useState(false);
  /* ---------------- DATE HELPERS ---------------- */

  const today = new Date();
  const isFirstOfMonth = today.getDate() === 2 || slotPlanDayEnabled;
  // const isFirstOfMonth = true;

  const getMonth = () => {
    // if its the slot planning day, show next month, else show current month
    // return isFirstOfMonth ? new Date().getMonth() + 1 : new Date().getMonth();
    return isFirstOfMonth ? new Date().getMonth() : new Date().getMonth();
  }
  const planningDate = new Date();
  planningDate.setMonth(getMonth());

  const nextMonthName = planningDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(getFirstDayOfMonth(isFirstOfMonth));

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [doctorSlots, setDoctorSlots] = useState<any[]>([]);
  const [pharmacistSlots, setPharmacistSlots] = useState<any[]>([]);
  const [isSlotRequestPopupOpen, setIsSlotRequestPopupOpen] = useState(false);

  const [dayMapping, setDayMapping] = useState<
    Map<number, { date: number; label: string; isHoliday: boolean }>
  >(new Map());




  // const [slots, setSlots] = useState<SlotVisit[]>([
  //   ...mockDoctorVisits,
  //   ...mockPharmacistVisits,
  // ]);

  const feID = parseInt(sessionStorage.getItem("feID") || "0");
  const userType = "FE";

  useEffect(() => {
    // console.log("today date", today.getDate());
    checkIfSlotPlanEnabled();
    getPlannedVisits();
    console.log("Selected Week: ", selectedWeek, "Selected Day: ", selectedDay);
  }, [selectedWeek, selectedDay]);

  const checkIfSlotPlanEnabled = async () => {
    try {
      const response = await checkIfSlotPlanDayEnabled(userType, feID);
      setSlotPlanDayEnabled(response.canPlanSlot);
      // console.log("Check Slot Plan Day Response: ", response);
    } catch (error) {
      console.log("Error checking slot plan day: ", error);
    }
  };

  const getPlannedVisits = async () => {
    // if (isFirstOfMonth) {
    //   getPlannedDoctorVisits();
    //   getPlannedPharmacyVisits();
    // } else {
    //   getCurrentPlannedDoctorVisits();
    //   getCurrentPlannedPharmacyVisits();
    // }
      getCurrentPlannedDoctorVisits();
      getCurrentPlannedPharmacyVisits();
  };

  const getPlannedDoctorVisits = async () => {
    console.log("Fetching planned doctor visits for FE ID: ", feID, "Week: ", selectedWeek, "Day: ", selectedDay);
    const response = await fetchPlannedDoctorVisits(feID, selectedWeek, selectedDay.toString());
    setDoctorSlots([]);
    setDoctorSlots([...response]);
  };

  const getPlannedPharmacyVisits = async () => {
    const response = await fetchPlannedPharmacyVisits(feID, selectedWeek, selectedDay.toString());
    setPharmacistSlots(response);
  };

  const getCurrentPlannedDoctorVisits = async () => {
    const response = await fetchCurrentPlannedDoctorVisits(feID, selectedWeek, selectedDay.toString());
    setDoctorSlots(response);
  };

  const getCurrentPlannedPharmacyVisits = async () => {
    const response = await fetchCurrentPlannedPharmacyVisits(feID, selectedWeek, selectedDay.toString());
    setPharmacistSlots(response);
  };





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
      // let response = await planVisit(obj);
      let response = await planCurrentMonthVisit(obj);
      console.log("Plan Visit Response: ", response);
      getPlannedVisits();
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
      getPlannedVisits();
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

  const handleSlotDayRequestSubmit = async (data) => {
    try {
      // API call to create request
      const response = await slotPlanDayRequestFieldExecutive(data, feID);
      console.log("Submitting Slot Plan Day Request with data: ", data);
      toast({
        title: "Success",
        description: "Slot plan day request submitted successfully",
        variant: "default",
      });

      setIsSlotRequestPopupOpen(false);
    } catch (error) {
      console.log("Error submitting slot plan day request: ", error);
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };





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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Slot Planning</h1>
                <p className="text-muted-foreground">{nextMonthName}</p>
              </div>

              <Button
                onClick={() => setIsSlotRequestPopupOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Request Slot Plan Day
              </Button>
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
                  currentMonth={getMonth()}
                  isPastDisabled={false}
                  onWeekChange={setSelectedWeek}
                  onDayChange={setSelectedDay}
                  setDayMapping={setDayMapping}
                  dayMapping={dayMapping}
                  holidays={holidayList}
                />

                {isFirstOfMonth ? (
                  <>
                    {!(selectedWeek == 1 && dayMapping.get(selectedDay)?.date == 2) ? (<Button onClick={() => setIsAddModalOpen(true)}>
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

      <SlotPlanDayRequestModal
        isOpen={isSlotRequestPopupOpen}
        onClose={() => setIsSlotRequestPopupOpen(false)}
        onSubmit={handleSlotDayRequestSubmit}
        userType={userType}
        userId={feID}
      />
    </div>
  );
}
