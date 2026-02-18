import { useEffect, useState } from "react";
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
import { Phone, Mail, AlertCircle, Pencil, Shield, Crown, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ManagerContactUpdateRequest, updateManagerContactDetails } from "@/services/ContactService";
const InfoTile = ({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  danger?: boolean;
}) => (
  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        danger ? "bg-red-500/10" : "bg-primary/10"
      }`}
    >
      <Icon
        className={`w-4 h-4 ${
          danger ? "text-red-500" : "text-primary"
        }`}
      />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);
const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);


interface ContactInfo {
  id?: number;
  name: string;
  image?: string;
  phone: string;
  email: string;
  emergencyContact: string;
  role?: string;
}

interface ManagerContactDetailsProps {
  manager: ContactInfo | null;
  admin: ContactInfo | null;
  superAdmin: ContactInfo | null;
  teamMembers: ContactInfo[];
  onUpdateManager: (data: ContactInfo) => void;
}

const ManagerContactDetails = ({
  manager,
  admin,
  superAdmin,
  teamMembers,
  onUpdateManager,
}: ManagerContactDetailsProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [editForm, setEditForm] = useState<ContactInfo | null>(null);
   const managerId = Number(sessionStorage.getItem("userID"));
   const [loading, setLoading] = useState(false);

     useEffect(() => {
    if (manager) setEditForm(manager);
  }, [manager]);
  
  

 const handleUpdate = async () => {
    try {
      setLoading(true);
       const payload: ManagerContactUpdateRequest = {
      phone: editForm.phone,
      email: editForm.email,
      emergencyContact: editForm.emergencyContact,
    };
      const updated = await updateManagerContactDetails(managerId, payload);
      onUpdateManager(updated);
      setIsModalOpen(false);
      toast({ title: "Contact updated successfully" });
    } catch (err: any) {
      console.log( err?.response?.data?.message);
      toast({
        title: "Update failed",
        description:
          err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("");
  };

  const ViewOnlyContactCard = ({
    contact,
    icon: Icon,
    iconColor,
  }: {
    contact: ContactInfo;
    icon: React.ElementType;
    iconColor: string;
  }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Avatar className="w-10 h-10">
        <AvatarImage src={contact.image} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium truncate">
            {contact.name}
          </h4>
          <div
            className={`w-5 h-5 ${iconColor} rounded flex items-center justify-center`}
          >
            <Icon className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {contact.role}
        </p>
      </div>

      <div className="hidden sm:flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {contact.phone}
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {contact.email}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* My Contact */}
      <div className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-3">
          My Contact Details
        </h3>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                 {manager?.image ? (
    <AvatarImage src={manager.image} alt={manager.name ?? "Manager"} />
  ) : null}
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(manager?.name ?? "User")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {manager?.name ?? "User"}
                </h3>
                <p className="text-xs text-muted-foreground">
                 {manager?.role ? (
    <span className="text-xs text-muted-foreground">
      {manager.role}
    </span>
  ) : (
    <span className="text-xs text-muted-foreground italic">
      Manager
    </span>
  )}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Update
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <InfoTile icon={Phone} label="Phone" value={manager?.phone ?? "null"} />
              <InfoTile icon={Mail} label="Email" value={manager?.email ?? "null"} />
              <InfoTile
                icon={AlertCircle}
                label="Emergency"
                value={manager?.emergencyContact??"null"}
                danger
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Contacts */}
      {(superAdmin || admin) && (
        <div className="mb-6">
          <h3 className="text-sm text-muted-foreground mb-3">
            Admin Contacts
          </h3>
          <Card>
            <CardContent className="p-4 space-y-3">
              {superAdmin && (
                <ViewOnlyContactCard
                  contact={superAdmin}
                  icon={Crown}
                  iconColor="bg-amber-500"
                />
              )}
              {admin && (
                <ViewOnlyContactCard
                  contact={admin}
                  icon={Shield}
                  iconColor="bg-blue-500"
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team */}
      <div className="mb-6">
        <h3 className="text-sm text-muted-foreground mb-3">
          Team Members ({teamMembers.length})
        </h3>
        <Card>
          <CardContent className="p-4 space-y-3">
            {teamMembers.map((m) => (
              <ViewOnlyContactCard
                key={m.email}
                contact={m}
                icon={Users}
                iconColor="bg-green-500"
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact</DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4">
              <Field label="Phone" value={editForm.phone}
                onChange={(v) => setEditForm({ ...editForm, phone: v })} />
              <Field label="Email" value={editForm.email}
                onChange={(v) => setEditForm({ ...editForm, email: v })} />
              <Field label="Emergency" value={editForm.emergencyContact}
                onChange={(v) =>
                  setEditForm({ ...editForm, emergencyContact: v })
                } />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagerContactDetails;