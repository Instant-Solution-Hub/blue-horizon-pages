import { useState } from "react";
import { Plus, Clock, CheckCircle2, XCircle, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplyWorkApprovalModal from "./ApplyWorkApprovalModal";
import { fetchCurrentMonthWorkApprovals } from "@/services/WorkApprovalService";
import { useEffect } from "react";


interface WorkRequest {
  id: string;
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}



const WorkApprovalRequestList = () => {

  const feId = localStorage.getItem("feId") || 1;
  const managerId = localStorage.getItem("managerId");

  const isFieldExecutive = !!feId;
  const isManager = !!managerId;

  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [showModal, setShowModal] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

const loadRequests = async () => {
  try {
    let data;

    if (isFieldExecutive) {
      data = await fetchCurrentMonthWorkApprovals(
        Number(feId),
        null
      );
    } else if (isManager) {
      data = await fetchCurrentMonthWorkApprovals(
        null,
        Number(managerId)
      );
    } else {
      console.error("No valid user role found in localStorage");
      return;
    }

    const mapped = data.map((item: any) => ({
      id: item.id.toString(),
      date: item.workDate,
      description: item.description,
      status: item.status.toLowerCase(),
      submittedOn: item.createdAt?.split("T")[0],
    }));

    setRequests(mapped);
  } catch (err) {
    console.error("Error loading approvals", err);
  }
};


useEffect(() => {
  loadRequests();
}, []);


 const handleNewRequest = () => {
  loadRequests();
};


  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusConfig = {
    pending: { icon: Clock, label: "Pending", variant: "secondary" as const, className: "text-warning" },
    approved: { icon: CheckCircle2, label: "Approved", variant: "default" as const, className: "text-success" },
    rejected: { icon: XCircle, label: "Rejected", variant: "destructive" as const, className: "text-destructive" },
  };

  return (
    <div className="space-y-6">
      {/* Apply Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Apply for Work Approval
        </Button>
      </div>

      {/* Pending Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Send className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">Pending Requests</h2>
          <Badge variant="secondary">{pendingRequests.length}</Badge>
        </div>

        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending requests. Apply for a new work approval above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const config = statusConfig[req.status];
              return (
                <Card key={req.id} className="hover-lift card-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">
                            Requested for: {formatDate(req.date)}
                          </span>
        
                        </div>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                      <Badge variant={config.variant} className="shrink-0 flex items-center gap-1">
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Processed Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Processed Requests</h2>
          <Badge variant="secondary">{processedRequests.length}</Badge>
        </div>

        {processedRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No processed requests yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {processedRequests.map((req) => {
              const config = statusConfig[req.status];
              return (
                <Card key={req.id} className="opacity-80">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">
                            Requested for: {formatDate(req.date)}
                          </span>
                         
                        </div>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                      <Badge variant={config.variant} className="shrink-0 flex items-center gap-1">
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ApplyWorkApprovalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  );
};

export default WorkApprovalRequestList;
