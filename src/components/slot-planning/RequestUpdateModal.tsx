import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from "lucide-react";

interface Visit {
  id: number;
  name: string;
  type: "doctor" | "pharmacist";
}

interface RequestUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorVisits: Visit[];
  pharmacistVisits: Visit[];
  onSubmit: (data: { visitType: string; selectedVisits: number[]; notes: string }) => void;
}

export function RequestUpdateModal({
  open,
  onOpenChange,
  doctorVisits,
  pharmacistVisits,
  onSubmit,
}: RequestUpdateModalProps) {
  const [visitType, setVisitType] = useState<string>("");
  const [selectedVisits, setSelectedVisits] = useState<number[]>([]);
  const [notes, setNotes] = useState("");

  const filteredVisits = useMemo(() => {
    if (visitType === "doctor") return doctorVisits;
    if (visitType === "pharmacist") return pharmacistVisits;
    return [];
  }, [visitType, doctorVisits, pharmacistVisits]);

  const handleVisitToggle = (visitId: number, checked: boolean) => {
    if (checked) {
      setSelectedVisits((prev) => [...prev, visitId]);
    } else {
      setSelectedVisits((prev) => prev.filter((id) => id !== visitId));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      visitType,
      selectedVisits,
      notes,
    });
    // Reset form
    setVisitType("");
    setSelectedVisits([]);
    setNotes("");
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setVisitType("");
      setSelectedVisits([]);
      setNotes("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Slot Update</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Visit Type Selection */}
          <div className="space-y-2">
            <Label>Visit Type</Label>
            <Select value={visitType} onValueChange={(value) => {
              setVisitType(value);
              setSelectedVisits([]);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="pharmacist">Pharmacist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visits List */}
          {visitType && (
            <div className="space-y-2">
              <Label>Select Visits to Update</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {filteredVisits.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No {visitType} visits scheduled for today
                  </p>
                ) : (
                  filteredVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`visit-${visit.id}`}
                        checked={selectedVisits.includes(visit.id)}
                        onCheckedChange={(checked) =>
                          handleVisitToggle(visit.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`visit-${visit.id}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {visit.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide reason for update request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!visitType || selectedVisits.length === 0 || !notes.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
