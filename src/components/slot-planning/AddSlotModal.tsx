import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchDoctors, fetchPharmacists } from "@/services/UsersService";

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
    pharmacist?: any;
  }) => void;
}

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
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pharmacists, setPharmacists] = useState<any[]>([]);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>("");
  const [pharmacistSearchQuery, setPharmacistSearchQuery] = useState<string>("");

  useEffect(() => {
    getDoctors();
    getPharmacists();
  }, []);

  const getDoctors = async () => {
    let response = await fetchDoctors();
    setDoctors(response.data);
  };

  const getPharmacists = async () => {
    let response = await fetchPharmacists();
    setPharmacists(response);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    let pharmacist;
    if (visitType == "pharmacist") {
      pharmacist = pharmacists.find((pharm) => pharm.id.toString() === selectedId);
    }
    onAddSlot({
      type: visitType,
      id: parseInt(selectedId),
      week: selectedWeek,
      day: selectedDay,
      pharmacist: pharmacist,
    });

    setSelectedId("");
    setDoctorSearchQuery("");
    setPharmacistSearchQuery("");
    onOpenChange(false);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = doctorSearchQuery.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(searchLower) ||
      doctor.designation?.toLowerCase().includes(searchLower) ||
      doctor.hospitalName?.toLowerCase().includes(searchLower) ||
      doctor.category?.toLowerCase().includes(searchLower) ||
      doctor.practiceType?.toLowerCase().includes(searchLower)
    );
  });

  const filteredPharmacists = pharmacists?.filter((pharmacist) => {
    const searchLower = pharmacistSearchQuery.toLowerCase();
    return (
      pharmacist.contactPerson?.toLowerCase().includes(searchLower) ||
      pharmacist.pharmacyName?.toLowerCase().includes(searchLower) ||
      pharmacist.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add New Slot</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="max-h-[70vh] px-6 py-4">
          <div className="space-y-6">
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
                  setDoctorSearchQuery("");
                  setPharmacistSearchQuery("");
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
                
                {/* Search input for doctors */}
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors by name, hospital, designation, or category..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Doctor List - No ScrollArea here since parent is scrollable */}
                <div className="space-y-2">
                  {filteredDoctors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {doctorSearchQuery 
                        ? "No doctors match your search criteria." 
                        : "No doctors available."}
                    </p>
                  ) : (
                    filteredDoctors.map((doctor) => (
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
                            {doctor.practiceType && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Practice: {doctor.practiceType}
                              </p>
                            )}
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
                
                {/* Result count */}
                {filteredDoctors.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select Pharmacist</Label>
                
                {/* Search input for pharmacists */}
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pharmacists by name, pharmacy, or location..."
                    value={pharmacistSearchQuery}
                    onChange={(e) => setPharmacistSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Pharmacist List */}
                <div className="space-y-2">
                  {filteredPharmacists.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {pharmacistSearchQuery 
                        ? "No pharmacists match your search criteria." 
                        : "No pharmacists available."}
                    </p>
                  ) : (
                    filteredPharmacists.map((pharmacist) => (
                      <div
                        key={pharmacist.id}
                        onClick={() => setSelectedId(pharmacist.id.toString())}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedId === pharmacist.id.toString()
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <p className="font-medium">{pharmacist.contactPerson}</p>
                        <p className="text-sm text-muted-foreground">
                          {pharmacist.pharmacyName} • {pharmacist.location}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Result count for pharmacists */}
                {filteredPharmacists.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {filteredPharmacists.length} of {pharmacists?.length || 0} pharmacists
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t">
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