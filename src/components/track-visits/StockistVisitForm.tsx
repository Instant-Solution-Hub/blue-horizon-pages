import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface StockistVisitFormProps {
  onSubmit: (data: StockistVisitData) => void;
  onCancel: () => void;
}

export interface StockistVisitData {
  visitType: "stockist";
  stockistType: string;
  stockistName: string;
  contactPerson: string;
  contactNumber: string;
  activitiesPerformed: string[];
  orderValue: string;
  notes: string;
  location: { lat: number; lng: number } | null;
}

interface Stockist {
  id: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  type: string;
}

const mockStockists: Stockist[] = [
  { id: "1", name: "MedSupply India", contactPerson: "Rajesh Kumar", contactNumber: "9876543210", type: "Super stockist" },
  { id: "2", name: "PharmaDist Co", contactPerson: "Sunil Verma", contactNumber: "9876543211", type: "Substockist" },
  { id: "3", name: "HealthCare Supplies", contactPerson: "Anil Sharma", contactNumber: "9876543212", type: "Super stockist" },
];

const activities = ["Sales Order", "Payment Collection", "Stock Check", "Scheme Discussion", "Other"];

export function StockistVisitForm({ onSubmit, onCancel }: StockistVisitFormProps) {
  const [stockistType, setStockistType] = useState("");
  const [selectedStockist, setSelectedStockist] = useState<Stockist | null>(null);
  const [stockistSearch, setStockistSearch] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [orderValue, setOrderValue] = useState("");
  const [notes, setNotes] = useState("");

  const filteredStockists = mockStockists.filter(
    (s) =>
      s.name.toLowerCase().includes(stockistSearch.toLowerCase()) &&
      (stockistType ? s.type === stockistType : true)
  );

  const handleStockistSelect = (stockistId: string) => {
    const stockist = mockStockists.find((s) => s.id === stockistId);
    setSelectedStockist(stockist || null);
    if (stockist) {
      setStockistSearch(stockist.name);
    }
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    if (!stockistType || !selectedStockist) {
      alert("Please select stockist type and stockist");
      return;
    }
    if (selectedActivities.includes("Other") && !notes.trim()) {
      alert("Notes are mandatory when 'Other' activity is selected");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSubmit({
          visitType: "stockist",
          stockistType,
          stockistName: selectedStockist.name,
          contactPerson: selectedStockist.contactPerson,
          contactNumber: selectedStockist.contactNumber,
          activitiesPerformed: selectedActivities,
          orderValue: selectedActivities.includes("Sales Order") ? orderValue : "",
          notes,
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      },
      () => {
        onSubmit({
          visitType: "stockist",
          stockistType,
          stockistName: selectedStockist.name,
          contactPerson: selectedStockist.contactPerson,
          contactNumber: selectedStockist.contactNumber,
          activitiesPerformed: selectedActivities,
          orderValue: selectedActivities.includes("Sales Order") ? orderValue : "",
          notes,
          location: null,
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type of Stockist *</Label>
        <Select value={stockistType} onValueChange={setStockistType}>
          <SelectTrigger>
            <SelectValue placeholder="Select stockist type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Substockist">Substockist</SelectItem>
            <SelectItem value="Super stockist">Super Stockist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Stockist Name *</Label>
        <Input
          value={stockistSearch}
          onChange={(e) => {
            setStockistSearch(e.target.value);
            setSelectedStockist(null);
          }}
          placeholder="Search stockist..."
        />
        {stockistSearch && !selectedStockist && filteredStockists.length > 0 && (
          <div className="border rounded-md mt-1 max-h-32 overflow-y-auto bg-background">
            {filteredStockists.map((stockist) => (
              <div
                key={stockist.id}
                className="p-2 hover:bg-muted cursor-pointer text-sm"
                onClick={() => handleStockistSelect(stockist.id)}
              >
                {stockist.name} ({stockist.type})
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStockist && (
        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
          <p><span className="font-medium">Contact Person:</span> {selectedStockist.contactPerson}</p>
          <p><span className="font-medium">Contact Number:</span> {selectedStockist.contactNumber}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label>Activities Performed</Label>
        <div className="grid grid-cols-2 gap-2">
          {activities.map((activity) => (
            <div key={activity} className="flex items-center space-x-2">
              <Checkbox
                id={`stockist-${activity}`}
                checked={selectedActivities.includes(activity)}
                onCheckedChange={() => handleActivityToggle(activity)}
              />
              <Label htmlFor={`stockist-${activity}`} className="text-sm font-normal">
                {activity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {selectedActivities.includes("Sales Order") && (
        <div className="space-y-2">
          <Label>Order Value</Label>
          <Input
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value)}
            placeholder="Enter order value"
            type="number"
          />
        </div>
      )}

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
