import { useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SlotPlanDayRequest {
  id: number;
  reason: string;
  requestedManagerId: number | null;
  requestedManagerName: string | null;
  requestedFieldExecutiveId: number | null;
  requestedFieldExecutiveName: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt: string | null;
  adminNotes: string | null;
}

const mockRequests: SlotPlanDayRequest[] = [
  {
    id: 1,
    reason: "Need to reschedule visits due to doctor unavailability",
    requestedManagerId: null,
    requestedManagerName: null,
    requestedFieldExecutiveId: 5,
    requestedFieldExecutiveName: "AKHIL",
    status: "PENDING",
    requestedAt: "2026-03-08",
    reviewedAt: null,
    adminNotes: null,
  },
  {
    id: 3,
    reason: "Territory change requires slot plan update",
    requestedManagerId: 3,
    requestedManagerName: "SALEESH",
    requestedFieldExecutiveId: null,
    requestedFieldExecutiveName: null,
    status: "PENDING",
    requestedAt: "2026-03-08",
    reviewedAt: null,
    adminNotes: null,
  },
  {
    id: 4,
    reason: "New doctors added to territory",
    requestedManagerId: null,
    requestedManagerName: null,
    requestedFieldExecutiveId: 7,
    requestedFieldExecutiveName: "RAJESH",
    status: "APPROVED",
    requestedAt: "2026-03-05",
    reviewedAt: "2026-03-06",
    adminNotes: "Approved for March cycle",
  },
  {
    id: 5,
    reason: "Want to adjust weekly schedule",
    requestedManagerId: 2,
    requestedManagerName: "DEEPA",
    requestedFieldExecutiveId: null,
    requestedFieldExecutiveName: null,
    status: "REJECTED",
    requestedAt: "2026-03-04",
    reviewedAt: "2026-03-05",
    adminNotes: "Slot plan already locked for this month",
  },
];

const statusConfig = {
  PENDING: { label: "Pending", icon: Clock, variant: "outline" as const, className: "bg-amber-100 text-amber-800 border-amber-300" },
  APPROVED: { label: "Approved", icon: CheckCircle2, variant: "outline" as const, className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  REJECTED: { label: "Rejected", icon: XCircle, variant: "outline" as const, className: "bg-red-100 text-red-800 border-red-300" },
};

export default function AdminSlotPlanDayRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<SlotPlanDayRequest[]>(mockRequests);
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject"; request: SlotPlanDayRequest } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const processedRequests = requests.filter((r) => r.status !== "PENDING");

  const getRequesterInfo = (req: SlotPlanDayRequest) => {
    if (req.requestedFieldExecutiveName) {
      return { name: req.requestedFieldExecutiveName, role: "Field Executive" };
    }
    return { name: req.requestedManagerName ?? "Unknown", role: "Manager" };
  };

  const handleAction = () => {
    if (!actionModal) return;
    const { type, request } = actionModal;
    const newStatus = type === "approve" ? "APPROVED" : "REJECTED";

    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: newStatus as "APPROVED" | "REJECTED", reviewedAt: new Date().toISOString().split("T")[0], adminNotes: adminNotes || null }
          : r
      )
    );

    toast({
      title: type === "approve" ? "Request Approved" : "Request Rejected",
      description: `Slot plan day request from ${getRequesterInfo(request).name} has been ${newStatus.toLowerCase()}.`,
    });

    setActionModal(null);
    setAdminNotes("");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 rounded-xl">
                  <CalendarCheck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Slot Plan Day Requests</h1>
              </div>
              <p className="text-white/80 ml-14">
                Review and manage slot plan day unlock requests from Field Executives and Managers
              </p>
            </div>

            {/* Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Pending Requests
                  {pendingRequests.length > 0 && (
                    <Badge variant="destructive">{pendingRequests.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <RequestCard
                        key={req.id}
                        request={req}
                        onApprove={() => { setActionModal({ type: "approve", request: req }); setAdminNotes(""); }}
                        onReject={() => { setActionModal({ type: "reject", request: req }); setAdminNotes(""); }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Processed Requests */}
            {processedRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Processed Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {processedRequests.map((req) => (
                      <RequestCard key={req.id} request={req} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Approve / Reject Confirmation Modal */}
      <Dialog open={!!actionModal} onOpenChange={(open) => { if (!open) setActionModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionModal?.type === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
          </DialogHeader>
          {actionModal && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {actionModal.type === "approve"
                  ? "Are you sure you want to approve this slot plan day request?"
                  : "Are you sure you want to reject this slot plan day request?"}
              </p>
              <div className="text-sm border rounded-lg p-3 bg-muted/50 space-y-1">
                <p><span className="font-medium">From:</span> {getRequesterInfo(actionModal.request).name} ({getRequesterInfo(actionModal.request).role})</p>
                <p><span className="font-medium">Reason:</span> {actionModal.request.reason}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes (optional)</label>
                <Textarea
                  placeholder="Add notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button
              variant={actionModal?.type === "approve" ? "default" : "destructive"}
              onClick={handleAction}
            >
              {actionModal?.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: SlotPlanDayRequest;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const requesterName = request.requestedFieldExecutiveName ?? request.requestedManagerName ?? "Unknown";
  const requesterRole = request.requestedFieldExecutiveId ? "Field Executive" : "Manager";
  const config = statusConfig[request.status];

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{requesterName}</p>
          <Badge variant="secondary" className="text-xs mt-0.5">{requesterRole}</Badge>
        </div>
        <Badge variant={config.variant} className={config.className}>
          <config.icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p><span className="font-medium text-foreground">Reason:</span> {request.reason}</p>
        <p><span className="font-medium text-foreground">Requested:</span> {request.requestedAt}</p>
        {request.reviewedAt && (
          <p><span className="font-medium text-foreground">Reviewed:</span> {request.reviewedAt}</p>
        )}
        {request.adminNotes && (
          <p><span className="font-medium text-foreground">Admin Notes:</span> {request.adminNotes}</p>
        )}
      </div>

      {request.status === "PENDING" && onApprove && onReject && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={onApprove}>
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
        </div>
      )}
    </div>
  );
}
