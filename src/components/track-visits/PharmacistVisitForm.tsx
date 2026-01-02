import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PharmacistVisitFormProps {
  onSubmit: (data: PharmacistVisitData) => void;
  onCancel: () => void;
}

export interface PharmacistVisitData {
  visitType: "pharmacist";
  pharmacyName: string;
  contactPerson: string;
  contactNumber: string;
  activitiesPerformed: string[];
  notes: string;
  isMissed: boolean;
}

const activities = ["Offer", "Expiry", "Other"];

export function PharmacistVisitForm({ onSubmit, onCancel }: PharmacistVisitFormProps) {
  const [pharmacyName, setPharmacyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isMissed, setIsMissed] = useState(false);

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    if (!pharmacyName.trim() || !contactPerson.trim() || !contactNumber.trim()) {
      alert("Please fill all required fields");
      return;
    }
    if (selectedActivities.includes("Other") && !notes.trim()) {
      alert("Notes are mandatory when 'Other' activity is selected");
      return;
    }

    onSubmit({
      visitType: "pharmacist",
      pharmacyName,
      contactPerson,
      contactNumber,
      activitiesPerformed: selectedActivities,
      notes,
      isMissed,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pharmacy/Chemist Name *</Label>
        <Input
          value={pharmacyName}
          onChange={(e) => setPharmacyName(e.target.value)}
          placeholder="Enter pharmacy name"
        />
      </div>

      <div className="space-y-2">
        <Label>Contact Person *</Label>
        <Input
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          placeholder="Enter contact person name"
        />
      </div>

      <div className="space-y-2">
        <Label>Contact Number *</Label>
        <Input
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter contact number"
          type="tel"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="pharmacist-missed"
          checked={isMissed}
          onCheckedChange={(checked) => setIsMissed(checked as boolean)}
        />
        <Label htmlFor="pharmacist-missed" className="text-sm font-normal">
          Mark as Missed Visit
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Activities Performed</Label>
        <div className="flex gap-4">
          {activities.map((activity) => (
            <div key={activity} className="flex items-center space-x-2">
              <Checkbox
                id={`pharmacist-${activity}`}
                checked={selectedActivities.includes(activity)}
                onCheckedChange={() => handleActivityToggle(activity)}
              />
              <Label htmlFor={`pharmacist-${activity}`} className="text-sm font-normal">
                {activity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes {selectedActivities.includes("Other") && "(Required)"}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Submit Visit
        </Button>
      </div>
    </div>
  );
}
