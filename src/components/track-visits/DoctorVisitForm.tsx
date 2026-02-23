import { useEffect, useState } from "react";
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
  doctorName: string;
  hospital: string;
  designation: string;
  category: string;
  practiceType: string;
  visitId: string;
  isMissed: boolean;
  status: string;
}

interface DoctorVisitFormProps {
  onSubmit: (data: DoctorVisitData) => void;
  onCancel: () => void;
  doctorVisits: any[];
  products: any[];
  onDesignationChange?: (designation: string) => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ConversionRow {
  productId: number;
  quantity: number;
  value: number;
}


export interface DoctorVisitData {
  visitType: "doctor";
  doctorId: string;
  visitId: string,
  doctorName: string;
  hospital: string;
  designation: string;
  category: string;
  practiceType: string;
  isMissed: boolean;
  isPreviouslyMissed: boolean;
  activitiesPerformed: string[];
  notes: string;
  location: { lat: number; lng: number } | null;
  convertedProducts?: {
    productId: number;
    quantity: number;
    value: number;
  }[];
}

// const products: Product[] = [
//   { id: 1, name: "Product A", price: 120 },
//   { id: 2, name: "Product B", price: 85 },
//   { id: 3, name: "Product C", price: 60 },
// ];


const activities = [
  "Product Detailing",
  "Sample Distribution",
  "Study Distribution",
  "Stock Updates",
  "Product Conversion",
  "Prescription Review",
  "Follow-up Discussion",
  "New Product Introduction",
];

export function DoctorVisitForm({ onSubmit, onCancel, products, doctorVisits, onDesignationChange }: DoctorVisitFormProps) {
  const [selectedVisit, setSelectedVisit] = useState<ScheduledDoctor | null>(null);
  const [isMissed, setIsMissed] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [conversionRows, setConversionRows] = useState<ConversionRow[]>([
    { productId: 0, quantity: 1, value: 0 },
  ]);

  useEffect(() => {
    console.log("Doctor Visits in DoctorVisitForm:", doctorVisits);
  }, []);

  const handleDoctorChange = (visitId: string) => {
    const doctor = doctorVisits.find((d) => d.visitId === visitId);
    onDesignationChange(doctor.designation);
    setSelectedVisit(doctor || null);
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

 const handleSubmit = () => {
  if (!selectedVisit) return;

  if (!isMissed && selectedActivities.length === 0) {
    alert("Please select at least one activity performed");
    return;
  }

  if (
    selectedActivities.includes("Product Conversion") &&
    conversionRows.some((r) => !r.productId || r.quantity <= 0)
  ) {
    alert("Please select product and quantity for all conversion rows");
    return;
  }

  if (isMissed && !notes.trim()) {
    alert("Notes are mandatory for missed visits");
    return;
  }

  const convertedProducts =
    selectedActivities.includes("Product Conversion")
      ? conversionRows
          .filter((r) => r.productId)
          .map((r) => ({
            productId: Number(r.productId),
            quantity: r.quantity,
            value: r.value,
          }))
      : [];

  const payload = {
    visitType: "doctor" as const,
    doctorId: selectedVisit.id,
    visitId: selectedVisit.visitId,
    doctorName: selectedVisit.doctorName,
    hospital: selectedVisit.hospital,
    designation: selectedVisit.designation,
    category: selectedVisit.category,
    practiceType: selectedVisit.practiceType,
    isMissed,
    isPreviouslyMissed: selectedVisit.status === "MISSED",
    activitiesPerformed: selectedActivities,
    notes,
    convertedProducts,
  };

  // ✅ If missed, no need to capture location
  if (isMissed) {
    onSubmit({
      ...payload,
      location: null,
    });
    return;
  }

  // Otherwise capture location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSubmit({
        ...payload,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    },
    () => {
      onSubmit({
        ...payload,
        location: null,
      });
    }
  );
};

  const handleAddRow = () => {
    setConversionRows([...conversionRows, { productId: 0, quantity: 1, value: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    setConversionRows(conversionRows.filter((_, i) => i !== index));
  };

  const getProductPrice = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.price : 0;
  };

  const handleRowChange = (
    index: number,
    field: keyof ConversionRow,
    value: string | number
  ) => {
    const updated = [...conversionRows];
    const row = { ...updated[index], [field]: value };

    const price = getProductPrice(row.productId);
    row.value = price * row.quantity;

    updated[index] = row;
    setConversionRows(updated);
  };


  const getRowPrice = (row: ConversionRow) => {
    const product = products.find((p) => p.id === row.productId);
    return product ? product.price * row.quantity : 0;
  };

  const subTotal = conversionRows.reduce(
    (sum, row) => sum + row.value,
    0
  );



  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Visit (Scheduled for Today)</Label>
        <Select onValueChange={handleDoctorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctorVisits.map((visit, index) => (
              <SelectItem key={visit.visitId} value={visit.visitId}>
                {visit.doctorName} - {visit.hospital} {visit?.status === "MISSED" ? "- Missed" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVisit && (
        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {selectedVisit.doctorName}</p>
          <p><span className="font-medium">Hospital:</span> {selectedVisit.hospital}</p>
          <p><span className="font-medium">Speciality:</span> {selectedVisit.designation}</p>
          <p><span className="font-medium">Category:</span> {selectedVisit.category}</p>
          <p><span className="font-medium">Prescription Type:</span> {selectedVisit.practiceType}</p>
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

      {selectedActivities.includes("Product Conversion") && (
        <div className="space-y-3 border rounded-lg p-3">
          <Label className="font-medium">Product Conversion Details</Label>

          <table className="w-full text-sm border">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {conversionRows.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <Select
                      value={row.productId.toString()}
                      onValueChange={(value) =>
                        handleRowChange(index, "productId", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      className="w-20 border rounded px-2 py-1"
                      value={row.quantity}
                      onChange={(e) =>
                        handleRowChange(index, "quantity", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="p-2 font-medium">
                    ₹{getRowPrice(row)}
                  </td>

                  <td className="p-2 text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemoveRow(index)}
                      disabled={conversionRows.length === 1}
                    >
                      −
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <Button size="sm" variant="outline" onClick={handleAddRow}>
              + Add Product
            </Button>

            <div className="font-semibold">
              Sub Total: ₹{subTotal}
            </div>
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
        <Button onClick={handleSubmit} disabled={!selectedVisit}>
          Submit Visit
        </Button>
      </div>
    </div>
  );
}
