// src/pages/PortalLockedPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { requestPortalUnlock } from "@/services/PortalService";

const PortalLockedPage = () => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");

    const handleSubmit = async () => {
        if (!reason.trim()) {
            alert("Please enter a reason.");
            return;
        }

        try {
            const response = await requestPortalUnlock(reason);
            console.log("Unlock request reason:", reason);
            setReason("");
            setOpen(false);
            toast({
                title: "Request Sent",
                description: `Your request to unlock the portal has been sent. Once the administrator accepts it, you can access the portal again.`,
            });

        } catch (error) {
            console.log("Unlock request failed:", error);
            setReason("");
            setOpen(false);
            toast({
                title: "Request Failed to Send",
                description: `Your request to unlock the portal failed. Please try again later.`,
            });
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-2xl font-bold text-red-600">Portal Locked</h1>
            <p className="mt-2 text-gray-600">
                Your access has been temporarily restricted.
            </p>
            <p className="text-sm text-gray-400 mb-6">
                Please contact your administrator.
            </p>

            <Button onClick={() => setOpen(true)}>
                Request Unlock
            </Button>

            {/* Popup Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Portal Unlock</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Enter your reason for requesting unlock..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Submit Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PortalLockedPage;
