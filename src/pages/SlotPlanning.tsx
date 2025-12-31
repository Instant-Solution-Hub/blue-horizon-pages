import { useState } from "react";
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
import { Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ---------------- MOCK DATA ---------------- */

const mockDoctorVisits: SlotVisit[] = [
  {
    id: 1,
    type: "doctor",
    name: "Dr. John Smith",
    category: "A_PLUS",
    practiceType: "RP",
    designation: "Cardiologist",
    hospitalName: "City Hospital",
    visitTrack: "Visit 2/3",
  },
  {
    id: 2,
    type: "doctor",
    name: "Dr. Sarah Wilson",
    category: "A",
    practiceType: "OP",
    designation: "Pediatrician",
    hospitalName: "Metro Clinic",
    visitTrack: "Visit 1/2",
  },
  {
    id: 3,
    type: "doctor",
    name: "Dr. Mike Johnson",
    category: "B",
    practiceType: "NP",
    designation: "General",
    hospitalName: "Community Health",
    visitTrack: "Visit 1/1",
  },
];

const mockPharmacistVisits: SlotVisit[] = [
  {
    id: 4,
    type: "pharmacist",
    name: "James Miller",
    hospitalName: "City Pharmacy",
    visitTrack: "Scheduled",
  },
  {
    id: 5,
    type: "pharmacist",
    name: "Lisa Anderson",
    hospitalName: "MedPlus",
    visitTrack: "Scheduled",
  },
];

/* ---------------- PAGE ---------------- */

export default function SlotPlanning() {
  const { toast } = useToast();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [slots, setSlots] = useState<SlotVisit[]>([
    ...mockDoctorVisits,
    ...mockPharmacistVisits,
  ]);

  /* ---------------- DATE HELPERS ---------------- */

  const today = new Date();
  const isFirstOfMonth = today.getDate() === 1;
  const currentMonthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleAddSlot = (slot: {
    type: "doctor" | "pharmacist";
    id: number;
    week: number;
    day: number;
  }) => {
    toast({
      title: "Slot Added",
      description: `${
        slot.type === "doctor" ? "Doctor" : "Pharmacist"
      } visit scheduled for Week ${slot.week}, Day ${slot.day}`,
    });
  };

  const handleDeleteSlot = (id: number) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
    toast({
      title: "Slot Removed",
      description: "The visit has been removed from your schedule.",
    });
  };

  /**
   * 🔥 UPDATED: single visit instead of array
   */
  const handleRequestUpdate = (data: {
    visitType: string;
    visitId: number;
    notes: string;
  }) => {
    toast({
      title: "Request Sent",
      description: `Your slot update request for the selected ${data.visitType} visit has been sent to your manager for approval.`,
    });
  };

  /* ---------------- FILTERS ---------------- */

  const doctorSlots = slots.filter((s) => s.type === "doctor");
  const pharmacistSlots = slots.filter((s) => s.type === "pharmacist");

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Slot Planning</h1>
              <p className="text-muted-foreground">{currentMonthName}</p>
            </div>

            <MonthlyTargetProgress />
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
                  onWeekChange={setSelectedWeek}
                  onDayChange={setSelectedDay}
                />

                {isFirstOfMonth ? (
                  <>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Slot
                    </Button>

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
                              key={slot.id}
                              {...slot}
                              canDelete
                              onDelete={handleDeleteSlot}
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
                            <SlotCard
                              key={slot.id}
                              {...slot}
                              canDelete
                              onDelete={handleDeleteSlot}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <SlotTable title="Doctor Visits" visits={doctorSlots} />
                    <SlotTable
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
          id: s.id,
          name: s.name,
          type: "doctor",
        }))}
        pharmacistVisits={pharmacistSlots.map((s) => ({
          id: s.id,
          name: s.name,
          type: "pharmacist",
        }))}
        onSubmit={handleRequestUpdate}
      />
    </div>
  );
}
