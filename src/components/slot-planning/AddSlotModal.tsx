import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Doctor {
  id: number;
  name: string;
  category: string;
  practiceType: string;
  designation: string;
  hospitalName: string;
  scheduledCount: number;
  maxSchedules: number;
}

interface Pharmacist {
  id: number;
  name: string;
  pharmacyName: string;
  location: string;
}

interface AddSlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWeek: number;
  selectedDay: number;
  onAddSlot: (slot: {
    type: "doctor" | "pharmacist";
    id: number;
    week: number;
    day: number;
  }) => void;
}

// Mock data - replace with actual API data
const mockDoctors: Doctor[] = [
  { id: 1, name: "Dr. John Smith", category: "A_PLUS", practiceType: "RP", designation: "Cardiologist", hospitalName: "City Hospital", scheduledCount: 1, maxSchedules: 3 },
  { id: 2, name: "Dr. Sarah Wilson", category: "A", practiceType: "OP", designation: "Pediatrician", hospitalName: "Metro Clinic", scheduledCount: 2, maxSchedules: 2 },
  { id: 3, name: "Dr. Mike Johnson", category: "B", practiceType: "NP", designation: "General", hospitalName: "Community Health", scheduledCount: 0, maxSchedules: 1 },
  { id: 4, name: "Dr. Emily Brown", category: "A_PLUS", practiceType: "RP", designation: "Neurologist", hospitalName: "Central Medical", scheduledCount: 3, maxSchedules: 3 },
  { id: 5, name: "Dr. David Lee", category: "A", practiceType: "OP", designation: "Orthopedic", hospitalName: "Bone & Joint Center", scheduledCount: 0, maxSchedules: 2 },
];

const mockPharmacists: Pharmacist[] = [
  { id: 1, name: "James Miller", pharmacyName: "City Pharmacy", location: "Downtown" },
  { id: 2, name: "Lisa Anderson", pharmacyName: "MedPlus", location: "Suburb" },
  { id: 3, name: "Robert Taylor", pharmacyName: "Health Mart", location: "Central" },
];

const categoryColors: Record<string, string> = {
  A_PLUS: "bg-emerald-100 text-emerald-800",
  A: "bg-blue-100 text-blue-800",
  B: "bg-amber-100 text-amber-800",
};

export function AddSlotModal({
  open,
  onOpenChange,
  selectedWeek,
  selectedDay,
  onAddSlot,
}: AddSlotModalProps) {
  const [visitType, setVisitType] = useState<"doctor" | "pharmacist">("doctor");
  const [selectedId, setSelectedId] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedId) return;
    
    onAddSlot({
      type: visitType,
      id: parseInt(selectedId),
      week: selectedWeek,
      day: selectedDay,
    });
    
    setSelectedId("");
    onOpenChange(false);
  };

  const availableDoctors = mockDoctors.filter(
    (doc) => doc.scheduledCount < doc.maxSchedules
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Week and Day Display */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Week</Label>
              <div className="mt-1 p-2 bg-muted rounded-md font-medium">
                Week {selectedWeek}
              </div>
            </div>
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Day</Label>
              <div className="mt-1 p-2 bg-muted rounded-md font-medium">
                Day {selectedDay}
              </div>
            </div>
          </div>

          {/* Visit Type Selection */}
          <div className="space-y-2">
            <Label>Visit Type</Label>
            <Select
              value={visitType}
              onValueChange={(value: "doctor" | "pharmacist") => {
                setVisitType(value);
                setSelectedId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="pharmacist">Pharmacist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Doctor/Pharmacist Selection */}
          {visitType === "doctor" ? (
            <div className="space-y-2">
              <Label>Select Doctor</Label>
              <ScrollArea className="h-[250px] border rounded-md p-2">
                <div className="space-y-2">
                  {availableDoctors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All doctors have reached their schedule limit.
                    </p>
                  ) : (
                    availableDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => setSelectedId(doctor.id.toString())}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedId === doctor.id.toString()
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doctor.designation} • {doctor.hospitalName}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className={categoryColors[doctor.category]}
                            >
                              {doctor.category === "A_PLUS" ? "A+" : doctor.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {doctor.scheduledCount}/{doctor.maxSchedules} scheduled
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Select Pharmacist</Label>
              <ScrollArea className="h-[250px] border rounded-md p-2">
                <div className="space-y-2">
                  {mockPharmacists.map((pharmacist) => (
                    <div
                      key={pharmacist.id}
                      onClick={() => setSelectedId(pharmacist.id.toString())}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedId === pharmacist.id.toString()
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium">{pharmacist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pharmacist.pharmacyName} • {pharmacist.location}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedId}>
            Add Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
