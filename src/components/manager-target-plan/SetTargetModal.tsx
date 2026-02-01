import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldExecutive {
  id: string;
  name: string;
  territory: string;
   primaryTarget: number;
  secondaryTarget: number;
}

interface SetTargetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldExecutives: FieldExecutive[];
  onSetTarget: (data: {
    feId: string;
    primaryTarget: number;
    secondaryTarget: number;
  }) => void;
}

const SetTargetModal = ({
  open,
  onOpenChange,
  fieldExecutives,
  onSetTarget,
}: SetTargetModalProps) => {
  const [selectedFE, setSelectedFE] = useState<FieldExecutive | null>(null);
  const [primaryTarget, setPrimaryTarget] = useState(0);
  const [secondaryTarget, setSecondaryTarget] = useState(0);

  const handleSubmit = () => {
    if (!selectedFE || !primaryTarget || !secondaryTarget) return;

    onSetTarget({
      feId: selectedFE.id,
      primaryTarget: primaryTarget,
      secondaryTarget:secondaryTarget,
    });

    setSelectedFE(null);
    setPrimaryTarget(0);
    setSecondaryTarget(0);
    onOpenChange(false);
  };

  const handleFEChange = (feId: string) => {
  const fe = fieldExecutives.find((f) => f.id === feId);
  if (!fe) return;

  setSelectedFE(fe);
  setPrimaryTarget(fe.primaryTarget || 0);
  setSecondaryTarget(fe.secondaryTarget || 0);
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Monthly Target</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Field Executive</Label>
         <Select onValueChange={handleFEChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select Field Executive" />
  </SelectTrigger>
  <SelectContent>
    {fieldExecutives.map((fe) => (
      <SelectItem key={fe.id} value={fe.id}>
        {fe.name} — {fe.territory}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>

          <div className="space-y-2">
            <Label>Monthly Primary Sales Target (₹)</Label>
           <Input
  type="number"
  value={primaryTarget}
  onChange={(e) => setPrimaryTarget(Number(e.target.value))}
/>

          </div>

          <div className="space-y-2">
            <Label>Monthly Secondary Sales Target (₹)</Label>
          <Input
  type="number"
  value={secondaryTarget}
  onChange={(e) => setSecondaryTarget(Number(e.target.value))}
/>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Set Target</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetTargetModal;
