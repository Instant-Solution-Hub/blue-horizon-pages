import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import type { FieldExecutive } from "./FieldExecutiveList";
import type { Manager } from "./ManagerList";

interface UpdateFieldExecutiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldExecutive: FieldExecutive | null;
  managers: Manager[];
  onUpdate: (fe: FieldExecutive) => void;
}

const UpdateFieldExecutiveModal = ({
  open,
  onOpenChange,
  fieldExecutive,
  managers,
  onUpdate,
}: UpdateFieldExecutiveModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    territory: "",
    region: "",
    markets: "",
    managerId: "",
  });

  useEffect(() => {
    if (fieldExecutive) {
      setFormData({
        name: fieldExecutive.name,
        phone: fieldExecutive.phone,
        territory: fieldExecutive.territory,
        region: fieldExecutive.region,
        markets: fieldExecutive.markets.join(", "),
        managerId: fieldExecutive.managerId,
      });
    }
  }, [fieldExecutive]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fieldExecutive) return;

    // Validation
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      toast({ title: "Error", description: "Phone must be a valid 10-digit number", variant: "destructive" });
      return;
    }
    if (!formData.territory.trim()) {
      toast({ title: "Error", description: "Territory is required", variant: "destructive" });
      return;
    }
    if (!formData.region.trim()) {
      toast({ title: "Error", description: "Region is required", variant: "destructive" });
      return;
    }
    if (!formData.markets.trim()) {
      toast({ title: "Error", description: "Markets is required", variant: "destructive" });
      return;
    }
    if (!formData.managerId) {
      toast({ title: "Error", description: "Manager is required", variant: "destructive" });
      return;
    }

    const marketsArray = formData.markets
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m);

    const selectedManager = managers.find((m) => m.id === formData.managerId);

    onUpdate({
      ...fieldExecutive,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      territory: formData.territory.trim(),
      region: formData.region.trim(),
      markets: marketsArray,
      managerId: formData.managerId,
      managerName: selectedManager?.name || "",
    });

    onOpenChange(false);
    toast({ title: "Success", description: "Field Executive updated successfully" });
  };

  if (!fieldExecutive) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Field Executive</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-fe-name">Name *</Label>
            <Input
              id="update-fe-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-email">Email</Label>
            <Input
              id="update-fe-email"
              value={fieldExecutive.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-employeeCode">Employee Code</Label>
            <Input
              id="update-fe-employeeCode"
              value={fieldExecutive.employeeCode}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-phone">Phone *</Label>
            <Input
              id="update-fe-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-territory">Territory *</Label>
            <Input
              id="update-fe-territory"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              placeholder="Enter territory"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-region">Region *</Label>
            <Input
              id="update-fe-region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="Enter region"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-markets">Markets * (comma separated)</Label>
            <Input
              id="update-fe-markets"
              value={formData.markets}
              onChange={(e) => setFormData({ ...formData, markets: e.target.value })}
              placeholder="e.g., Market A, Market B, Market C"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-fe-manager">Manager *</Label>
            <Select
              value={formData.managerId}
              onValueChange={(value) => setFormData({ ...formData, managerId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Field Executive</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFieldExecutiveModal;
