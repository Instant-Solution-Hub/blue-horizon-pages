import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface PharmacistVisitFormProps {
  onSubmit: (data: PharmacistVisitData) => void;
  onCancel: () => void;
  pharmacistVisits: any[];
}

export interface PharmacistVisitData {
  visitId: string;
  visitType: "pharmacist";
  pharmacyName: string;
  contactPerson: string;
  contactNumber: string;
  activitiesPerformed: string[];
  location: { lat: number; lng: number } | null;
  notes: string;
  isMissed: boolean;
  isPreviouslyMissed: boolean;
}

const activities = ["Offer", "Expiry", "Other"];

export function PharmacistVisitForm({ onSubmit, onCancel, pharmacistVisits }: PharmacistVisitFormProps) {
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
    if (selectedActivities.includes("Other") && !notes.trim()) {
      alert("Notes are mandatory when 'Other' activity is selected");
      return;
    }

    onSubmit({
      visitId: selectedVisit ? selectedVisit.visitId : "",
      visitType: "pharmacist",
      pharmacyName,
      contactPerson,
      contactNumber,
      activitiesPerformed: selectedActivities,
      location: null,
      notes,
      isMissed,
      isPreviouslyMissed: selectedVisit.status === "MISSED" ? true : false,
    });

    // navigator.geolocation.getCurrentPosition((position)=>{onSubmit({
    //   visitId: selectedVisit ? selectedVisit.visitId : "",
    //   visitType: "pharmacist",
    //   pharmacyName,
    //   contactPerson,
    //   contactNumber,
    //   activitiesPerformed: selectedActivities,
    //   location: { lat: position.coords.latitude, lng: position.coords.longitude },
    //   notes,
    //   isMissed,
    //   isPreviouslyMissed: selectedVisit.status === "MISSED" ? true : false,
    // });}, ()=>{
    //   onSubmit({
    //   visitId: selectedVisit ? selectedVisit.visitId : "",
    //   visitType: "pharmacist",
    //   pharmacyName,
    //   contactPerson,
    //   contactNumber,
    //   activitiesPerformed: selectedActivities,
    //   location: null,
    //   notes,
    //   isMissed,
    //   isPreviouslyMissed: selectedVisit.status === "MISSED" ? true : false,
    // })
    // });
  };

  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);

  const handleVisitChange = (visitId: string) => {
    const pharmacist = pharmacistVisits.find((d) => d.visitId === visitId);
    setSelectedVisit(pharmacist || null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Visit (Scheduled for Today)</Label>
        <Select onValueChange={handleVisitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Pharmacist" />
          </SelectTrigger>
          <SelectContent>
            {pharmacistVisits.map((visit) => (
              <SelectItem key={visit.visitId} value={visit.visitId}>
                {visit.pharmacyName} - {visit.contactPerson}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVisit && (
        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
          <p><span className="font-medium">Contact Person:</span> {selectedVisit.contactPerson}</p>
          <p><span className="font-medium">Contact Number:</span> {selectedVisit.contactNumber}</p>
          <p><span className="font-medium">Pharmacy Name:</span> {selectedVisit.pharmacyName}</p>
        </div>
      )}

      {/* <div className="space-y-2">
        <Label>Pharmacy/Chemist Name *</Label>
        <Input
          value={pharmacyName}
          onChange={(e) => setPharmacyName(e.target.value)}
          placeholder="Enter pharmacy name"
        />
      </div> */}

      {/* <div className="space-y-2">
        <Label>Contact Person *</Label>
        <Input
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          placeholder="Enter contact person name"
        />
      </div> */}

      {/* <div className="space-y-2">
        <Label>Contact Number *</Label>
        <Input
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter contact number"
          type="tel"
        />
      </div> */}

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
