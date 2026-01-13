import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, AlertCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FEContactUpdateRequest, updateFEContactDetails } from "@/services/ContactService";

interface ContactDetailsProps {
  feId: number;
  contact: {
    phone: string;
    email: string;
    emergencyContact: string;
    name:string;
  } | null;
  onUpdate: (updated: {
    phone: string;
    email: string;
    emergencyContact: string;
    name:string;
  }) => void;
}

const ContactDetails = ({ feId, contact, onUpdate }: ContactDetailsProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    email: "",
    emergencyContact: "",
  });

  useEffect(() => {
    if (contact) {
      setForm(contact);
    }
  }, [contact]);

  if (!contact) return null;

  const handleUpdate = async () => {
    try {
      setLoading(true);
       const payload: FEContactUpdateRequest = {
      phone: form.phone,
      email: form.email,
      emergencyContact: form.emergencyContact,
    };
      const updated = await updateFEContactDetails(feId, payload);
      onUpdate(updated);
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

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                FE
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              <p className="text-xs text-muted-foreground">
               Product Development Executive
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-1" /> Update
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoCard icon={<Phone />} label="Phone" value={contact.phone} />           
            <InfoCard icon={<Mail />} label="Email" value={contact.email} />    
            <InfoCard
  icon={<AlertCircle className="text-red-500" />}
  label="Emergency"
  value={contact?.emergencyContact ?? ""}
/>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Field
              label="Emergency Contact"
              value={form.emergencyContact}
              onChange={(v) =>
                setForm({ ...form, emergencyContact: v })
              }
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactDetails;

/* ---------- Helpers ---------- */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);



const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);
