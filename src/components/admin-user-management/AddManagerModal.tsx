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
import { useToast } from "@/hooks/use-toast";
import type { Manager } from "./ManagerList";
import { ManagerInfo } from "@/pages/AdminUserManagement";

interface AddManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (manager: ManagerInfo) => void;
}

const AddManagerModal = ({ open, onOpenChange, onAdd }: AddManagerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employeeCode: "",
    department: "",
    designation: "",
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
    if (!formData.password.trim() || formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      toast({ title: "Error", description: "Phone must be a valid 10-digit number", variant: "destructive" });
      return;
    }
    if (!formData.employeeCode.trim()) {
      toast({ title: "Error", description: "Employee Code is required", variant: "destructive" });
      return;
    }
    if (!formData.department.trim()) {
      toast({ title: "Error", description: "Department is required", variant: "destructive" });
      return;
    }
    if (!formData.designation.trim()) {
      toast({ title: "Error", description: "Designation is required", variant: "destructive" });
      return;
    }
    onAdd({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      phone: formData.phone.trim(),
      employeeCode: formData.employeeCode.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
      managedTerritories: []
    });

    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      employeeCode: "",
      department: "",
      designation: "",
    });
    onOpenChange(false);
    toast({ title: "Success", description: "Manager added successfully" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeCode">Employee Code *</Label>
            <Input
              id="employeeCode"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              placeholder="Enter employee code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Enter department"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="Enter designation"
              required
            />
          </div>

          {/* Managed Territories field removed as it is fetched from backend */}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Manager</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManagerModal;
