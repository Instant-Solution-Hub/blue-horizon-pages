import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";

export const SlotPlanDayRequestModal: React.FC<any> = ({
    isOpen,
    onClose,
    onSubmit,
    userType,
    userId
}) => {
    const [formData, setFormData] = useState<any>({
        reason: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                ...formData,
            });
        } finally {
             setFormData({
                reason: '',
            });
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                reason: '',
            });
            onClose();
        }
    };

    const userTypeDisplay = userType === 'MANAGER' ? 'Manager' : 'Field Executive';

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Request Slot Plan Day
                    </DialogTitle>
                    <DialogDescription>
                        Submit a request for slot planning today.
                        Your request will be reviewed by the admin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Request</Label>
                        <Textarea
                            id="reason"
                            placeholder="Please provide a reason for your slot plan day request..."
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                            className="min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {formData.reason.length}/500
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            <span className="font-semibold">Note:</span> After submission, your request will be
                            reviewed by an admin.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.reason}
                            className="min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2">Submitting</span>
                                    <span className="animate-spin">⚪</span>
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
