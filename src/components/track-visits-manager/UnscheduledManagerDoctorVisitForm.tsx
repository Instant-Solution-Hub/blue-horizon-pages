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
import { Input } from "@/components/ui/input"; // Add this import

interface ScheduledDoctor {
  id: string;
  name: string;
  hospitalName: string;
  designation: string;
  category: string;
  practiceType: string;
  isMissed: boolean;
  status: string;
}

interface DoctorVisitFormProps {
  onSubmit: (data: UnscheduledManagerDoctorVisitData) => void;
  onCancel: () => void;
  doctors: any[];
  products: any[];
  onDesignationChange: (designation: string) => void;
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

export interface UnscheduledManagerDoctorVisitData {
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
}

const activities = [
  "Product Detailing",
  "Sample Distribution",
  "Study Distribution",
  "Stock Updates",
  "Prescription Review",
  "Follow-up Discussion",
  "New Product Introduction",
];

export function UnscheduledManagerDoctorVisitForm({ onSubmit, onCancel, products, doctors, onDesignationChange }: DoctorVisitFormProps) {
  const [selectedVisit, setSelectedVisit] = useState<ScheduledDoctor | null>(null);
  const [isMissed, setIsMissed] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [conversionRows, setConversionRows] = useState<ConversionRow[]>([
    { productId: 0, quantity: 1, value: 0 },
  ]);

  // Search state
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter doctors based on search
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.hospitalName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.designation.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    onDesignationChange(doctor.designation);
    setSelectedVisit(doctor || null);
    setDoctorSearch(doctor?.name || "");
    setIsDropdownOpen(false);
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

    if (isMissed && !notes.trim()) {
      alert("Notes are mandatory for missed visits");
      return;
    }

    onSubmit({
      visitType: "doctor",
      doctorId: selectedVisit.id,
      doctorName: selectedVisit.name,
      hospital: selectedVisit.hospitalName,
      designation: selectedVisit.designation,
      category: selectedVisit.category,
      practiceType: selectedVisit.practiceType,
      isMissed,
      activitiesPerformed: selectedActivities,
      notes,
    });
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
        <Label>Select Doctor</Label>

        {/* Custom Searchable Select */}
        <div className="relative">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search doctor by name, hospital or specialty..."
              value={doctorSearch}
              onChange={(e) => {
                setDoctorSearch(e.target.value);
                setIsDropdownOpen(true);
                if (selectedVisit && e.target.value !== selectedVisit.name) {
                  setSelectedVisit(null);
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pr-8"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              ▼
            </Button>
          </div>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleDoctorChange(doctor.id)}
                    >
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-gray-600">
                        {doctor.hospitalName} • {doctor.designation}
                      </div>
                      <div className="text-xs text-gray-500">
                        Category: {doctor.category} • Practice: {doctor.practiceType}
                        {doctor.status === "MISSED" && " • Missed"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-center">
                    No doctors found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedVisit && (
        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {selectedVisit.name}</p>
          <p><span className="font-medium">Hospital:</span> {selectedVisit.hospitalName}</p>
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