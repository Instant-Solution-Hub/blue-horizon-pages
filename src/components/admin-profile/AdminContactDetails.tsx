import { useState } from "react";
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

const AdminContactDetails = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Admin's own contact details (editable)
  const [adminInfo, setAdminInfo] = useState<ContactInfo>({
    name: "Amit Sharma",
    image: "",
    phone: "+91 98765 55555",
    email: "amit.sharma@larimarpharma.com",
    emergencyNumber: "+91 98765 66666",
    role: "Super Admin",
  });

  const [editForm, setEditForm] = useState(adminInfo);

  // Manager contact details (view only)
  const managers: ContactInfo[] = [
    {
      name: "Priya Mehta",
      image: "",
      phone: "+91 98765 11111",
      email: "priya.mehta@larimarpharma.com",
      emergencyNumber: "+91 98765 22222",
      role: "Regional Manager",
      territory: "North Region",
    },
    {
      name: "Vikram Desai",
      image: "",
      phone: "+91 98765 33333",
      email: "vikram.desai@larimarpharma.com",
      emergencyNumber: "+91 98765 44444",
      role: "Regional Manager",
      territory: "South Region",
    },
    {
      name: "Ananya Roy",
      image: "",
      phone: "+91 98765 77777",
      email: "ananya.roy@larimarpharma.com",
      emergencyNumber: "+91 98765 88888",
      role: "Regional Manager",
      territory: "East Region",
    },
  ];

  // Field Executive contact details (view only)
  const fieldExecutives: ContactInfo[] = [
    {
      name: "Rahul Sharma",
      image: "",
      phone: "+91 98765 12121",
      email: "rahul.sharma@larimarpharma.com",
      emergencyNumber: "+91 98765 23232",
      role: "Field Executive",
      territory: "North Region",
    },
    {
      name: "Sneha Patel",
      image: "",
      phone: "+91 98765 34343",
      email: "sneha.patel@larimarpharma.com",
      emergencyNumber: "+91 98765 45454",
      role: "Field Executive",
      territory: "North Region",
    },
    {
      name: "Kiran Kumar",
      image: "",
      phone: "+91 98765 56565",
      email: "kiran.kumar@larimarpharma.com",
      emergencyNumber: "+91 98765 67676",
      role: "Field Executive",
      territory: "South Region",
    },
    {
      name: "Meera Nair",
      image: "",
      phone: "+91 98765 78787",
      email: "meera.nair@larimarpharma.com",
      emergencyNumber: "+91 98765 89898",
      role: "Field Executive",
      territory: "South Region",
    },
    {
      name: "Arjun Reddy",
      image: "",
      phone: "+91 98765 90909",
      email: "arjun.reddy@larimarpharma.com",
      emergencyNumber: "+91 98765 01010",
      role: "Field Executive",
      territory: "East Region",
    },
  ];

  const handleUpdate = () => {
    setAdminInfo(editForm);
    setIsModalOpen(false);
    toast({
      title: "Contact Updated",
      description: "Your contact details have been updated successfully.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("");
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
      {/* Managers Contacts (View Only) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Managers ({managers.length})</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-3">
            {managers.map((manager, index) => (
              <ViewOnlyContactCard 
                key={index} 
                contact={manager} 
                icon={Shield} 
                iconColor="bg-blue-500" 
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Field Executives Contacts (View Only) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Field Executives ({fieldExecutives.length})</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-3">
            {fieldExecutives.map((fe, index) => (
              <ViewOnlyContactCard 
                key={index} 
                contact={fe} 
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

export default AdminContactDetails;
