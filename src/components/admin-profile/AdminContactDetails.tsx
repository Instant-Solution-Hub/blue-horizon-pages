import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, AlertCircle, Pencil, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  name: string;
  image: string;
  phone: string;
  email: string;
  emergencyNumber: string;
  role?: string;
  territory?: string;
}

const AdminContactDetails = ({
  adminContact,
  superAdminContact,
  feContacts,
  managers,
  onUpdate,
}: {
  adminContact?: any | null;
  superAdminContact?: any | null;
  feContacts?: any[];
  managers?: any[];
  onUpdate?: (payload: { phone: string; email: string; emergencyContact: string }) => Promise<any>;
}) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialAdmin: ContactInfo = {
    name: adminContact?.name || "",
    image: adminContact?.image || "",
    phone: adminContact?.phone || "",
    email: adminContact?.email || "",
    emergencyNumber: adminContact?.emergencyContact || adminContact?.emergencyNumber || "",
    role: adminContact?.role || "Admin",
  };

  const [adminInfo, setAdminInfo] = useState<ContactInfo>(initialAdmin);
  const [editForm, setEditForm] = useState<ContactInfo>(initialAdmin);

  // Keep state in sync when prop changes
  useEffect(() => {
    const updated: ContactInfo = {
      name: adminContact?.name || "",
      image: adminContact?.image || "",
      phone: adminContact?.phone || "",
      email: adminContact?.email || "",
      emergencyNumber: adminContact?.emergencyContact || adminContact?.emergencyNumber || "",
      role: adminContact?.role || "Admin",
    };
    setAdminInfo(updated);
    setEditForm(updated);
  }, [adminContact]);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("");
  };

  const handleUpdate = async () => {
    try {
      if (onUpdate) {
        const payload = {
          phone: editForm.phone,
          email: editForm.email,
          emergencyContact: editForm.emergencyNumber,
        };
        const res = await onUpdate(payload);
        setAdminInfo({ ...editForm, name: res?.name || editForm.name });
        setIsModalOpen(false);
        toast({
          title: "Contact Updated",
          description: "Your contact details have been updated successfully.",
        });
        return;
      }

      // fallback local update
      setAdminInfo(editForm);
      setIsModalOpen(false);
      toast({
        title: "Contact Updated",
        description: "Your contact details have been updated successfully.",
      });
    } catch (err) {
      console.error("Update admin contact failed", err);
      toast({
        title: "Error",
        description: "Failed to update contact details",
        variant: "destructive",
      });
    }
  };

  // Compact contact card for view-only contacts
  const ViewOnlyContactCard = ({ 
    contact, 
    icon: Icon, 
    iconColor 
  }: { 
    contact: ContactInfo; 
    icon: React.ElementType; 
    iconColor: string;
  }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={contact.image} alt={contact.name} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground truncate">{contact.name}</h4>
          <div className={`w-5 h-5 ${iconColor} rounded flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {contact.role} {contact.territory && `• ${contact.territory}`}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          <span className="truncate max-w-[100px]">{contact.phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span className="truncate max-w-[140px]">{contact.email}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Super Admin Contact (View Only) - COMES FIRST */}
      {superAdminContact && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Super Admin</h3>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <ViewOnlyContactCard
                contact={{
                  name: superAdminContact.name || "Super Admin",
                  image: superAdminContact.image || "",
                  phone: superAdminContact.phone || "",
                  email: superAdminContact.email || "",
                  emergencyNumber: superAdminContact.emergencyContact || superAdminContact.emergencyNumber || "",
                  role: superAdminContact.role || "Super Admin",
                }}
                icon={Shield}
                iconColor="bg-purple-600"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Managers Contacts (View Only) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Managers ({(managers || []).length})</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-3">
            {(managers || []).map((m: any, idx: number) => (
              <ViewOnlyContactCard
                key={idx}
                contact={{
                  name: m.name || m.managerName || "",
                  image: m.image || "",
                  phone: m.phone || m.contact || "",
                  email: m.email || "",
                  emergencyNumber: m.emergencyContact || m.emergencyNumber || "",
                  role: m.role || "Manager",
                  territory: m.territory || m.marketName || "",
                }}
                icon={Shield}
                iconColor="bg-blue-500"
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Field Executives Contacts (View Only) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Field Executives ({(feContacts || []).length})</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-3">
            {(feContacts || []).map((fe: any, index: number) => (
              <ViewOnlyContactCard
                key={index}
                contact={{
                  name: fe.name || fe.feName || "",
                  image: fe.image || "",
                  phone: fe.phone || fe.contact || "",
                  email: fe.email || "",
                  emergencyNumber: fe.emergencyContact || fe.emergencyNumber || "",
                  role: "Field Executive",
                  territory: fe.territory || "",
                }}
                icon={Users}
                iconColor="bg-green-500"
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* My Contact Details (Editable) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">My Contact Details</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              {/* Top row: Avatar, Name, and Update Button */}
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                  <AvatarImage src={adminInfo.image} alt={adminInfo.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {getInitials(adminInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {adminInfo.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{adminInfo.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditForm(adminInfo);
                    setIsModalOpen(true);
                  }}
                  className="gap-1.5 flex-shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Update</span>
                </Button>
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium truncate">{adminInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{adminInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Emergency</p>
                    <p className="text-sm font-medium truncate">{adminInfo.emergencyNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Contact Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label>Emergency Number</Label>
              <Input
                value={editForm.emergencyNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, emergencyNumber: e.target.value })
                }
                placeholder="Enter emergency number"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// end

export default AdminContactDetails;
