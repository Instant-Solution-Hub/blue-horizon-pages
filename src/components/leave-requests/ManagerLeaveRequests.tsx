import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, User } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {toast} from "sonner";
import { fetchManagerLeaveRequests , ManagerLeaveRequest , approveManagerLeaveRequest , rejectManagerLeaveRequest} from "@/services/ManagerLeaveService";



const ManagerLeaveRequestsTab = () => {

  const [leaveRequests, setLeaveRequests] = useState<ManagerLeaveRequest[]>([]);
   const managerId = Number(sessionStorage.getItem("userID"));

  const [leaves, setLeaves] = useState<ManagerLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        setLoading(true);
        const data = await fetchManagerLeaveRequests();
        setLeaves(data);
        console.log(data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, [managerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "SICK_LEAVE":
        return "Sick Leave";
      case "CASUAL_LEAVE":
        return "Casual Leave";
      case "EARNED_LEAVE":
        return "Earned Leave";
      default:
        return type;
    }
  };

  const calculateDays = (
  fromDate: string | Date,
  toDate: string | Date
): number => {
  const start = typeof fromDate === "string"
    ? new Date(fromDate)
    : fromDate;

  const end = typeof toDate === "string"
    ? new Date(toDate)
    : toDate;

  // Normalize to avoid time-zone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();

  // +1 if you want inclusive days (15–16 = 2 days)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

 const handleApprove = async (id: number) => {
  try {
    const updated = await approveManagerLeaveRequest(id);

    setLeaves((prev) =>
      prev.map((req) =>
        req.id === id ? updated : req
      )
    );

   if (updated.status === "APPROVED") {
      toast.success("Leave approved successfully");
    } else if (updated.status === "REJECTED") {
      toast.error("Leave rejected due to insufficient leave balance");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to approve leave");
  }
};

const handleReject = async (id: number) => {
  try {
    const updated = await rejectManagerLeaveRequest(id);

    setLeaves((prev) =>
      prev.map((req) =>
        req.id === id ? updated : req
      )
    );

    toast.error("Leave rejected");
  } catch (err) {
    console.error(err);
    toast.error("Failed to reject leave");
  }
};


  const pendingRequests = leaves.filter((r) => r.status === "PENDING");
  const processedRequests = leaves.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          Pending Requests ({pendingRequests.length})
        </h3>
        {pendingRequests.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-6 text-center text-muted-foreground">
              No pending leave requests.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-border/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {request.managerName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {request.managerCode}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm ml-11">
                        <div>
                          <span className="text-muted-foreground">Type: </span>
                          <span className="font-medium">
                            {getLeaveTypeLabel(request.leaveType)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">From: </span>
                          <span className="font-medium">
                            {format(request.fromDate, "dd MMM")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">To: </span>
                          <span className="font-medium">
                            {format(request.toDate, "dd MMM")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Days: </span>
                          <span className="font-medium text-primary">
                            {calculateDays(request.fromDate, request.toDate)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-11">
                        <span className="font-medium">Reason: </span>
                        {request.reason}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 ml-11">
                        Applied on: {format(request.appliedDate, "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-11 lg:ml-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        disabled ={request.status !== "PENDING"}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                        disabled ={request.status !== "PENDING"}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" />
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

      {/* Processed Requests */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
          Processed Requests ({processedRequests.length})
        </h3>
        {processedRequests.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-6 text-center text-muted-foreground">
              No processed leave requests.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {processedRequests.map((request) => (
              <Card key={request.id} className="border-border/50 shadow-sm opacity-80">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {request.managerName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {request.managerCode}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm ml-11">
                        <div>
                          <span className="text-muted-foreground">Type: </span>
                          <span className="font-medium">
                            {getLeaveTypeLabel(request.leaveType)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">From: </span>
                          <span className="font-medium">
                            {format(request.fromDate, "dd MMM")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">To: </span>
                          <span className="font-medium">
                            {format(request.toDate, "dd MMM")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Days: </span>
                          <span className="font-medium">
                            {calculateDays(request.fromDate, request.toDate)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-11">
                        <span className="font-medium">Reason: </span>
                        {request.reason}
                      </p>
                    </div>
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

export default ManagerLeaveRequestsTab;
