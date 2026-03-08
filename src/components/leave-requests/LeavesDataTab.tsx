import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, User, Search } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {toast} from "sonner";
import { fetchTeamLeaveRequests , LeaveRequest , approveLeaveRequest , rejectLeaveRequest, fetchLeaveRequests} from "@/services/ManagerLeaveService";
import { Input } from "../ui/input";



const LeavesDataTab = () => {

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
   const [searchQuery, setSearchQuery] = useState("");
   const managerId = Number(sessionStorage.getItem("userID"));

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        setLoading(true);
        const data = await fetchTeamLeaveRequests(managerId);
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

   const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return leaves;
    const q = searchQuery.toLowerCase();
    return leaves.filter((r) => r.feName.toLowerCase().includes(q));
  }, [leaves, searchQuery]);

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


  const processedRequests = filteredRequests.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6">
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
                            {request.feCode}
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

export default LeavesDataTab;
