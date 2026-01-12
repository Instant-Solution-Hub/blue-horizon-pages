import { useState, useMemo } from "react";
import { format, differenceInDays } from "date-fns";
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
import { LeaveType } from "@/services/LeaveService";

interface ApplyLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (leave: {
    leaveType: LeaveType;
    fromDate: string;
    toDate: string;
    reason: string;
  }) => void;
   leaveBalance: LeaveBalance;
}

interface LeaveBalance {
  CASUAL_LEAVE: { used: number; total: number };
  SICK_LEAVE: { used: number; total: number };
}

const ApplyLeaveModal = ({ open, onOpenChange, onApply , leaveBalance }: ApplyLeaveModalProps) => {
  const { toast } = useToast();
  const [leaveType, setLeaveType] = useState<LeaveType | "">("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [reason, setReason] = useState("");

  // Calculate remaining leaves for selected type
  const remainingLeaves = useMemo(() => {
    if (leaveType === "CASUAL_LEAVE") {
      return leaveBalance.CASUAL_LEAVE.total - leaveBalance.CASUAL_LEAVE.used;
    }
    if (leaveType === "SICK_LEAVE") {
      return leaveBalance.SICK_LEAVE.total - leaveBalance.SICK_LEAVE.used;
    }
    return null; // No limit for earned leave
  }, [leaveType]);

  // Calculate selected days
  const selectedDays = useMemo(() => {
    if (fromDate && toDate) {
      return differenceInDays(toDate, fromDate) + 1;
    }
    return 0;
  }, [fromDate, toDate]);

  // Check if selection exceeds available leaves
  const exceedsLimit = useMemo(() => {
    if (remainingLeaves === null) return false; // Earned leave has no limit
    return selectedDays > remainingLeaves;
  }, [selectedDays, remainingLeaves]);

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

    if (exceedsLimit) {
      toast({
        title: "Insufficient Leave Balance",
        description: `You only have ${remainingLeaves} ${leaveType === "CASUAL_LEAVE" ? "casual" : "sick"} leave(s) remaining.`,
        variant: "destructive",
      });
      return;
    }

   onApply({
  leaveType: leaveType as LeaveType,
  fromDate: fromDate!.toISOString(),
  toDate: toDate!.toISOString(),
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

  // Reset dates when leave type changes
  const handleLeaveTypeChange = (value: LeaveType) => {
    setLeaveType(value);
    setFromDate(undefined);
    setToDate(undefined);
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
            <Select value={leaveType} onValueChange={handleLeaveTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                <SelectItem value="EARNED_LEAVE">Earned Leave</SelectItem>
              </SelectContent>
            </Select>
            {leaveType && remainingLeaves !== null && (
              <p className="text-xs text-muted-foreground">
                Available: <span className={cn("font-medium", remainingLeaves <= 2 ? "text-amber-600" : "text-green-600")}>{remainingLeaves}</span> day(s)
              </p>
            )}
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

          {/* Days Selected & Warning */}
          {fromDate && toDate && (
            <div className={cn(
              "px-3 py-2 rounded-md text-sm",
              exceedsLimit ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              {selectedDays} day(s) selected
              {exceedsLimit && remainingLeaves !== null && (
                <span className="block text-xs mt-1">
                  Exceeds available balance of {remainingLeaves} day(s)
                </span>
              )}
            </div>
          )}

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
          <Button onClick={handleSubmit} disabled={exceedsLimit}>
            Submit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyLeaveModal;
