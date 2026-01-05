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
import { Phone, Mail, AlertCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  name: string;
  image: string;
  phone: string;
  email: string;
  emergencyNumber: string;
}

const ContactDetails = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "Rahul Sharma",
    image: "",
    phone: "+91 98765 43210",
    email: "rahul.sharma@larimarpharma.com",
    emergencyNumber: "+91 98765 12345",
  });

  const [editForm, setEditForm] = useState(contactInfo);

  const handleUpdate = () => {
    setContactInfo(editForm);
    setIsModalOpen(false);
    toast({
      title: "Contact Updated",
      description: "Your contact details have been updated successfully.",
    });
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20">
              <AvatarImage src={contactInfo.image} alt={contactInfo.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {contactInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {contactInfo.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency</p>
                    <p className="text-sm font-medium">
                      {contactInfo.emergencyNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditForm(contactInfo);
                setIsModalOpen(true);
              }}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

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

export default ContactDetails;
