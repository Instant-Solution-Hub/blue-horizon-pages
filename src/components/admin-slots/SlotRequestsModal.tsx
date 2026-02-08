import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface SlotRequest {
  id: number;
  requesterName: string;
  employeeCode: string;
  role: "Field Executive" | "Manager";
  visitType: string;
  visitName: string;
  week: number;
  day: number;
  notes: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

interface SlotRequestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: SlotRequest[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export function SlotRequestsModal({
  open,
  onOpenChange,
  requests,
  onApprove,
  onReject,
}: SlotRequestsModalProps) {
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Slot Update Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length} pending
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No slot update requests
            </p>
          ) : (
            <>
              {/* Pending */}
              {pendingRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Pending ({pendingRequests.length})
                  </h3>
                  {pendingRequests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))}
                </div>
              )}

              {/* Processed */}
              {processedRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Processed ({processedRequests.length})
                  </h3>
                  {processedRequests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: SlotRequest;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{request.requesterName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-xs">
              {request.employeeCode}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {request.role}
            </Badge>
          </div>
        </div>
        <Badge
          variant="outline"
          className={statusBadge[request.status] || ""}
        >
          {request.status}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <span className="font-medium text-foreground">Visit:</span>{" "}
          {request.visitType} — {request.visitName}
        </p>
        <p>
          <span className="font-medium text-foreground">Slot:</span> Week{" "}
          {request.week}, Day {request.day}
        </p>
        <p>
          <span className="font-medium text-foreground">Reason:</span>{" "}
          {request.notes}
        </p>
        <p className="text-xs">{request.requestedAt}</p>
      </div>

      {request.status === "pending" && onApprove && onReject && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={() => onApprove(request.id)}>
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(request.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
