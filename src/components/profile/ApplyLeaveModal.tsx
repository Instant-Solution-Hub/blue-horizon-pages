import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ApplyLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (leave: {
    leaveType: string;
    status: string;
    fromDate: Date;
    toDate: Date;
    reason: string;
  }) => void;
}

const ApplyLeaveModal = ({ open, onOpenChange, onApply }: ApplyLeaveModalProps) => {
  const { toast } = useToast();
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!leaveType || !fromDate || !toDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (toDate < fromDate) {
      toast({
        title: "Invalid Dates",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }

    onApply({
      leaveType,
      status: "PENDING",
      fromDate,
      toDate,
      reason,
    });

    // Reset form
    setLeaveType("");
    setFromDate(undefined);
    setToDate(undefined);
    setReason("");
    onOpenChange(false);

    toast({
      title: "Leave Applied",
      description: "Your leave application has been submitted successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Leave Type *</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                <SelectItem value="EARNED_LEAVE">Earned Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status (Read Only) */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
              PENDING
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <Label>From Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label>To Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Enter reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Application</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyLeaveModal;
