import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { MonthlyTargetProgress } from "@/components/slot-planning/MonthlyTargetProgress";
import { WarningSection } from "@/components/slot-planning/WarningSection";
import { WeekDaySelector } from "@/components/slot-planning/WeekDaySelector";
import { SlotTable, SlotVisit } from "@/components/slot-planning/SlotTable";
import { SlotCard } from "@/components/slot-planning/SlotCard";
import { AddSlotModal } from "@/components/slot-planning/AddSlotModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for scheduled visits
const mockDoctorVisits: SlotVisit[] = [
  { id: 1, type: "doctor", name: "Dr. John Smith", category: "A_PLUS", practiceType: "RP", designation: "Cardiologist", hospitalName: "City Hospital", visitTrack: "Visit 2/3" },
  { id: 2, type: "doctor", name: "Dr. Sarah Wilson", category: "A", practiceType: "OP", designation: "Pediatrician", hospitalName: "Metro Clinic", visitTrack: "Visit 1/2" },
  { id: 3, type: "doctor", name: "Dr. Mike Johnson", category: "B", practiceType: "NP", designation: "General", hospitalName: "Community Health", visitTrack: "Visit 1/1" },
];

const mockPharmacistVisits: SlotVisit[] = [
  { id: 4, type: "pharmacist", name: "James Miller", hospitalName: "City Pharmacy", visitTrack: "Scheduled" },
  { id: 5, type: "pharmacist", name: "Lisa Anderson", hospitalName: "MedPlus", visitTrack: "Scheduled" },
];

export default function SlotPlanning() {
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [slots, setSlots] = useState<SlotVisit[]>([...mockDoctorVisits, ...mockPharmacistVisits]);

  // Check if it's the 1st of the month
  const today = new Date();
  const isFirstOfMonth = today.getDate() === 1;

  const currentMonthName = today.toLocaleString("default", { month: "long", year: "numeric" });

  const handleAddSlot = (slot: { type: "doctor" | "pharmacist"; id: number; week: number; day: number }) => {
    // In real implementation, this would add to the database
    toast({
      title: "Slot Added",
      description: `${slot.type === "doctor" ? "Doctor" : "Pharmacist"} visit scheduled for Week ${slot.week}, Day ${slot.day}`,
    });
  };

  const handleDeleteSlot = (id: number) => {
    setSlots(slots.filter((slot) => slot.id !== id));
    toast({
      title: "Slot Removed",
      description: "The visit has been removed from your schedule.",
    });
  };

  const handleRequestUpdate = () => {
    toast({
      title: "Request Sent",
      description: "Your slot update request has been sent to your manager for approval.",
    });
  };

  const doctorSlots = slots.filter((s) => s.type === "doctor");
  const pharmacistSlots = slots.filter((s) => s.type === "pharmacist");

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold">Slot Planning</h1>
              <p className="text-muted-foreground">{currentMonthName}</p>
            </div>

            {/* Monthly Target Progress */}
            <MonthlyTargetProgress />

            {/* Warning Section */}
            <WarningSection isFirstOfMonth={isFirstOfMonth} />

            {/* Monthly Slot Planning Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Monthly Slot Planning</CardTitle>
                {!isFirstOfMonth && (
                  <Button variant="outline" onClick={handleRequestUpdate}>
                    <Send className="h-4 w-4 mr-2" />
                    Request Slot Update
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Week and Day Selector */}
                <WeekDaySelector
                  selectedWeek={selectedWeek}
                  selectedDay={selectedDay}
                  onWeekChange={setSelectedWeek}
                  onDayChange={setSelectedDay}
                />

                {/* Content based on mode */}
                {isFirstOfMonth ? (
                  // Plan Mode
                  <div className="space-y-6">
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Slot
                    </Button>

                    {/* Doctor Visits */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Doctor Visits ({doctorSlots.length})
                      </h3>
                      {doctorSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                          No doctor visits scheduled. Click "Add New Slot" to schedule.
                        </p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {doctorSlots.map((slot) => (
                            <SlotCard
                              key={slot.id}
                              id={slot.id}
                              type="doctor"
                              name={slot.name}
                              category={slot.category}
                              practiceType={slot.practiceType}
                              designation={slot.designation}
                              hospitalName={slot.hospitalName}
                              visitTrack={slot.visitTrack}
                              canDelete={isFirstOfMonth}
                              onDelete={handleDeleteSlot}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pharmacist Visits */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Pharmacist Visits ({pharmacistSlots.length})
                      </h3>
                      {pharmacistSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                          No pharmacist visits scheduled. Click "Add New Slot" to schedule.
                        </p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {pharmacistSlots.map((slot) => (
                            <SlotCard
                              key={slot.id}
                              id={slot.id}
                              type="pharmacist"
                              name={slot.name}
                              hospitalName={slot.hospitalName}
                              visitTrack={slot.visitTrack}
                              canDelete={isFirstOfMonth}
                              onDelete={handleDeleteSlot}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <SlotTable title="Doctor Visits" visits={doctorSlots} />
                    <SlotTable title="Pharmacist Visits" visits={pharmacistSlots} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Slot Modal */}
      <AddSlotModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        onAddSlot={handleAddSlot}
      />
    </div>
  );
}
