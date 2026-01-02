import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduledDoctor {
  id: string;
  name: string;
  hospital: string;
  designation: string;
  category: string;
  practiceType: string;
}

interface DoctorVisitFormProps {
  onSubmit: (data: DoctorVisitData) => void;
  onCancel: () => void;
}

export interface DoctorVisitData {
  visitType: "doctor";
  doctorId: string;
  doctorName: string;
  hospital: string;
  designation: string;
  category: string;
  practiceType: string;
  isMissed: boolean;
  activitiesPerformed: string[];
  notes: string;
  location: { lat: number; lng: number } | null;
}

const mockScheduledDoctors: ScheduledDoctor[] = [
  { id: "1", name: "Dr. Rahul Sharma", hospital: "City Hospital", designation: "Cardiologist", category: "A+", practiceType: "Consultant" },
  { id: "2", name: "Dr. Priya Patel", hospital: "Apollo Clinic", designation: "Neurologist", category: "A", practiceType: "Visiting" },
  { id: "3", name: "Dr. Amit Kumar", hospital: "Max Healthcare", designation: "General Physician", category: "B", practiceType: "Resident" },
];

const activities = [
  "Product Detailing",
  "Sample Distribution",
  "Literature Sharing",
  "Prescription Review",
  "Follow-up Discussion",
  "New Product Introduction",
];

export function DoctorVisitForm({ onSubmit, onCancel }: DoctorVisitFormProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<ScheduledDoctor | null>(null);
  const [isMissed, setIsMissed] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleDoctorChange = (doctorId: string) => {
    const doctor = mockScheduledDoctors.find((d) => d.id === doctorId);
    setSelectedDoctor(doctor || null);
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    if (!selectedDoctor) return;
    if (!isMissed && selectedActivities.length === 0) {
      alert("Please select at least one activity performed");
      return;
    }
    if (isMissed && !notes.trim()) {
      alert("Notes are mandatory for missed visits");
      return;
    }

    // Get current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSubmit({
          visitType: "doctor",
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          hospital: selectedDoctor.hospital,
          designation: selectedDoctor.designation,
          category: selectedDoctor.category,
          practiceType: selectedDoctor.practiceType,
          isMissed,
          activitiesPerformed: selectedActivities,
          notes,
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      },
      () => {
        onSubmit({
          visitType: "doctor",
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          hospital: selectedDoctor.hospital,
          designation: selectedDoctor.designation,
          category: selectedDoctor.category,
          practiceType: selectedDoctor.practiceType,
          isMissed,
          activitiesPerformed: selectedActivities,
          notes,
          location: null,
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Doctor (Scheduled for Today)</Label>
        <Select onValueChange={handleDoctorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {mockScheduledDoctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.hospital}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDoctor && (
        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {selectedDoctor.name}</p>
          <p><span className="font-medium">Hospital:</span> {selectedDoctor.hospital}</p>
          <p><span className="font-medium">Designation:</span> {selectedDoctor.designation}</p>
          <p><span className="font-medium">Category:</span> {selectedDoctor.category}</p>
          <p><span className="font-medium">Practice Type:</span> {selectedDoctor.practiceType}</p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="missed"
          checked={isMissed}
          onCheckedChange={(checked) => setIsMissed(checked as boolean)}
        />
        <Label htmlFor="missed" className="text-sm font-normal">
          Mark as Missed Visit
        </Label>
      </div>

      {!isMissed && (
        <div className="space-y-2">
          <Label>Activities Performed (Required)</Label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={selectedActivities.includes(activity)}
                  onCheckedChange={() => handleActivityToggle(activity)}
                />
                <Label htmlFor={activity} className="text-sm font-normal">
                  {activity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Notes {isMissed && "(Required)"}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={isMissed ? "Please provide reason for missed visit..." : "Additional notes..."}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedDoctor}>
          Submit Visit
        </Button>
      </div>
    </div>
  );
}
