import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { createWorkApproval } from "@/services/WorkApprovalService";


interface ApplyWorkApprovalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; description: string }) => void;
}

const ApplyWorkApprovalModal = ({ open, onClose, onSubmit }: ApplyWorkApprovalModalProps) => {

    const feId = parseInt(sessionStorage.getItem("feID") || "0");
  const managerId = Number(sessionStorage.getItem("userID"));
  const isFeValid = Number.isFinite(feId) && feId > 0;

  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState("");

const handleSubmit = async () => {
  if (!date || !description.trim()) {
    toast({
      title: "Missing Fields",
      description: "Please select a date and enter a description.",
      variant: "destructive",
    });
    return;
  }

  try {
    await createWorkApproval({
  workDate: format(date, "yyyy-MM-dd"),
  description: description.trim(),
  fieldExecutiveId: isFeValid ? Number(feId) : null,
  managerId: isFeValid ? null : Number(managerId),

});


    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      description: description.trim(),
    });

    setDate(undefined);
    setDescription("");
    onClose();

    toast({
      title: "Request Submitted",
      description: "Your work approval request has been sent.",
    });
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to submit request.",
      variant: "destructive",
    });
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Work Approval</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d <= new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Description of Work</Label>
            <Textarea
              placeholder="Describe the purpose and details of working with Super Admin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Request</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyWorkApprovalModal;
