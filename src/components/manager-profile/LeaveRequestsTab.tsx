import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, User, Search } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface LeaveRequest {
  id: string;
  feName: string;
  feId: string;
  leaveType: string;
  status: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  appliedOn: Date;
}

const LeaveRequestsTab = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      feName: "Rajesh Kumar",
      feId: "FE001",
      leaveType: "SICK_LEAVE",
      status: "PENDING",
      fromDate: new Date(2025, 1, 5),
      toDate: new Date(2025, 1, 6),
      reason: "Fever and cold",
      appliedOn: new Date(2025, 1, 3),
    },
    {
      id: "2",
      feName: "Priya Sharma",
      feId: "FE002",
      leaveType: "CASUAL_LEAVE",
      status: "PENDING",
      fromDate: new Date(2025, 1, 10),
      toDate: new Date(2025, 1, 12),
      reason: "Family function",
      appliedOn: new Date(2025, 1, 1),
    },
    {
      id: "3",
      feName: "Amit Patel",
      feId: "FE003",
      leaveType: "EARNED_LEAVE",
      status: "APPROVED",
      fromDate: new Date(2025, 0, 20),
      toDate: new Date(2025, 0, 25),
      reason: "Annual vacation",
      appliedOn: new Date(2025, 0, 15),
    },
    {
      id: "4",
      feName: "Sneha Reddy",
      feId: "FE004",
      leaveType: "SICK_LEAVE",
      status: "REJECTED",
      fromDate: new Date(2025, 0, 28),
      toDate: new Date(2025, 0, 28),
      reason: "Medical checkup",
      appliedOn: new Date(2025, 0, 27),
    },
    {
      id: "5",
      feName: "Vikram Singh",
      feId: "FE005",
      leaveType: "CASUAL_LEAVE",
      status: "PENDING",
      fromDate: new Date(2025, 1, 15),
      toDate: new Date(2025, 1, 16),
      reason: "Personal work",
      appliedOn: new Date(2025, 1, 2),
    },
  ]);

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

  const calculateDays = (from: Date, to: Date) => {
    return differenceInDays(to, from) + 1;
  };

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "APPROVED" } : req
      )
    );
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully.",
    });
  };

  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "REJECTED" } : req
      )
    );
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected.",
      variant: "destructive",
    });
  };

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return leaveRequests;
    const q = searchQuery.toLowerCase();
    return leaveRequests.filter((r) => r.feName.toLowerCase().includes(q));
  }, [leaveRequests, searchQuery]);

  const pendingRequests = filteredRequests.filter((r) => r.status === "PENDING");
  const processedRequests = filteredRequests.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by FE name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-background"
        />
      </div>

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
                            {request.feName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {request.feId}
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
                        Applied on: {format(request.appliedOn, "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-11 lg:ml-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
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
                            {request.feName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {request.feId}
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

export default LeaveRequestsTab;
