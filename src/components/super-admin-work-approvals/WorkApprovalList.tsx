import { useEffect, useState } from "react";
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import {
  fetchCurrentMonthApprovals,
  approveWorkApproval,
  rejectWorkApproval,
} from "@/services/WorkApprovalService";

interface WorkRequest {
  id: number;
  workDate: string;
  requestedByName: string;
  requestedByRole: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const WorkApprovalList = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const adminId = Number(localStorage.getItem("superAdminId")) || 1;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await fetchCurrentMonthApprovals();
      setRequests(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load work approvals",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (id: number, action: "APPROVED" | "REJECTED") => {
    try {
      if (action === "APPROVED") {
        await approveWorkApproval(id, adminId);
      } else {
        await rejectWorkApproval(id, adminId);
      }

      // update UI
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action } : r))
      );

      toast({
        title: action === "APPROVED" ? "Request Approved" : "Request Rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Action failed",
        variant: "destructive",
      });
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const processedRequests = requests.filter((r) => r.status !== "PENDING");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-8">
      {/* Pending */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          <Badge variant="secondary">{pendingRequests.length}</Badge>
        </div>

        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending requests at the moment.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-semibold">
                          {req.requestedByName}
                        </span>

                        <Badge variant="outline" className="text-xs">
                          {req.requestedByRole}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          {formatDate(req.workDate)}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {req.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req.id, "APPROVED")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(req.id, "REJECTED")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Processed Requests</h2>
          <Badge variant="secondary">{processedRequests.length}</Badge>
        </div>

        <div className="space-y-3">
          {processedRequests.map((req) => (
            <Card key={req.id} className="opacity-80">
              <CardContent className="p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="font-semibold">
                        {req.requestedByName}
                      </span>

                      <Badge variant="outline" className="text-xs">
                        {req.requestedByRole}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {formatDate(req.workDate)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {req.description}
                    </p>
                  </div>

                  <Badge
                    variant={req.status === "APPROVED" ? "default" : "destructive"}
                  >
                    {req.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkApprovalList;
