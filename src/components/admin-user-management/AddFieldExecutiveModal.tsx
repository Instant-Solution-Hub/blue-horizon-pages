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
import { useToast } from "@/hooks/use-toast";
import type { FieldExecutive } from "./FieldExecutiveTable";
import type { Manager } from "./ManagerList";

interface AddFieldExecutiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managers: Manager[];
  onAdd: (fe: Omit<FieldExecutive, "id">) => void;
}

const AddFieldExecutiveModal = ({ open, onOpenChange, managers, onAdd }: AddFieldExecutiveModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    employeeCode: "",
    territory: "",
    region: "",
    markets: "",
    managerId: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast({ title: "Error", description: "Valid email is required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      toast({ title: "Error", description: "Phone must be a valid 10-digit number", variant: "destructive" });
      return;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (!formData.employeeCode.trim()) {
      toast({ title: "Error", description: "Employee Code is required", variant: "destructive" });
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

    onAdd({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      employeeCode: formData.employeeCode.trim(),
      territory: formData.territory.trim(),
      region: formData.region.trim(),
      markets: marketsArray,
      managerId: formData.managerId,
      managerName: selectedManager?.name || "",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      employeeCode: "",
      territory: "",
      region: "",
      markets: "",
      managerId: "",
    });
    onOpenChange(false);
    toast({ title: "Success", description: "Field Executive added successfully" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Field Executive</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fe-name">Name *</Label>
            <Input
              id="fe-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-email">Email *</Label>
            <Input
              id="fe-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-phone">Phone *</Label>
            <Input
              id="fe-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-password">Password *</Label>
            <Input
              id="fe-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-employeeCode">Employee Code *</Label>
            <Input
              id="fe-employeeCode"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              placeholder="Enter employee code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-territory">Territory *</Label>
            <Input
              id="fe-territory"
              value={formData.territory}
              onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
              placeholder="Enter territory"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-region">Region *</Label>
            <Input
              id="fe-region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="Enter region"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-markets">Markets * (comma separated)</Label>
            <Input
              id="fe-markets"
              value={formData.markets}
              onChange={(e) => setFormData({ ...formData, markets: e.target.value })}
              placeholder="e.g., Market A, Market B, Market C"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fe-manager">Manager *</Label>
            <Select
              value={formData.managerId}
              onValueChange={(value) => setFormData({ ...formData, managerId: value })}
            >
              <SelectTrigger className={!formData.managerId ? "border-destructive" : ""}>
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
            <Button type="submit">Add Field Executive</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldExecutiveModal;
