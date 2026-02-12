import { useState } from "react";
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface WorkRequest {
  id: string;
  requesterName: string;
  role: "Manager" | "Field Executive";
  date: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

const initialRequests: WorkRequest[] = [
  {
    id: "1",
    requesterName: "Rajesh Kumar",
    role: "Manager",
    date: "2026-02-15",
    description: "Request to accompany Super Admin for key account review at Apollo Hospital, Delhi region.",
  },
  {
    id: "2",
    requesterName: "Amit Verma",
    role: "Field Executive",
    date: "2026-02-18",
    description: "Joint visit with Super Admin for new product launch presentation to top doctors in East zone.",
  },
  {
    id: "3",
    requesterName: "Sneha Patel",
    role: "Manager",
    date: "2026-02-20",
    description: "Request for Super Admin presence during quarterly business review with West region stockists.",
  },
  {
    id: "4",
    requesterName: "Priya Sharma",
    role: "Field Executive",
    date: "2026-02-12",
    description: "Accompany for high-priority doctor conversion meeting in South territory.",
    status: "approved",
  },
  {
    id: "5",
    requesterName: "Vikram Singh",
    role: "Manager",
    date: "2026-02-10",
    description: "Joint field visit for competitive market analysis in Central region.",
    status: "rejected",
  },
].map((r) => ({ ...r, status: r.status || ("pending" as const) })) as WorkRequest[];

const WorkApprovalList = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<WorkRequest[]>(initialRequests);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    toast({
      title: action === "approved" ? "Request Approved" : "Request Rejected",
      description: `The work request has been ${action}.`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Pending Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">
            Pending Requests
          </h2>
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
              <Card key={req.id} className="hover-lift card-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {req.requesterName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {req.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(req.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.description}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">
            Processed Requests
          </h2>
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
            {processedRequests.map((req) => (
              <Card key={req.id} className="opacity-80">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {req.requesterName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {req.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(req.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.description}
                      </p>
                    </div>
                    <Badge
                      variant={req.status === "approved" ? "default" : "destructive"}
                      className="shrink-0 flex items-center gap-1"
                    >
                      {req.status === "approved" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {req.status === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkApprovalList;
