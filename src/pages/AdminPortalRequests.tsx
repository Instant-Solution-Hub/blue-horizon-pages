"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    UserCheck,
    UserX,
    Shield,
    Calendar,
    Mail,
    Phone,
    Hash,
    Building,
    MapPin,
    AlertCircle,
    RefreshCw,
    Download,
    Eye,
    CheckCheck,
    X,
    User,
    Briefcase
} from "lucide-react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { fetchAllPortalUnlockRequests, processPortalUnlockRequest } from "@/services/PortalService";

/* ---------------- TYPES ---------------- */

export type UserType = "FIELD_EXECUTIVE" | "Manager";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"; // extend if needed

export interface FieldExecutive {
    id: number;
    name: string;
    email: string;
    phone: string;
    employeeCode: string;
    territory: string | null;
    region: string | null;
    managerName: string | null;
    managerId: number | null;
    markets: string[] | null; // adjust if backend sends different structure
}

export interface Manager {
    id: number;
    name: string;
    email: string;
    phone: string;
    employeeCode: string;
    department: string | null;
    designation: string | null;
}

export interface PortalUnlockRequest {
    id: number;
    userType: UserType;
    lockedDate: string; // ISO date (yyyy-mm-dd)
    reason: string;
    status: RequestStatus;
    requestedAt: string; // ISO datetime
    reviewedAt: string | null;
    adminComments: string | null;
    fieldExecutive: FieldExecutive | null;
    manager: Manager | null;
}


interface RequestStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    //   highPriority: number;
}

/* ---------------- PAGE ---------------- */

export default function AdminPortalRequests() {
    const { toast } = useToast();

    const [requests, setRequests] = useState<PortalUnlockRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<PortalUnlockRequest | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [activeTab, setActiveTab] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: "",
        to: ""
    });

    const adminId = Number(sessionStorage.getItem("userID"));
    const adminName = sessionStorage.getItem("userName") || "Admin";

    useEffect(() => {
        fetchPortalRequests();
    }, []);

    /* ---------------- API CALLS ---------------- */

    const fetchPortalRequests = async () => {
        setIsLoading(true);
        try {
            // Replace with actual API call
            const response = await fetchAllPortalUnlockRequests();
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching portal requests:", error);

        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveRequest = async (requestId: number) => {
        try {
            let obj = {
                "adminId": adminId,
                "approve": true,
                "comments": "Approved by admin"
            }
            const response = await processPortalUnlockRequest(requestId, obj);
            fetchPortalRequests();
            toast({
                title: "Request Approved",
                description: "Portal unlock request has been approved successfully.",
            });

            setIsViewDialogOpen(false);
        } catch (error) {
            console.error("Error approving request:", error);
            toast({
                title: "Approval Failed",
                description: "Failed to approve the request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        if (!rejectionReason.trim()) {
            toast({
                title: "Rejection Reason Required",
                description: "Please provide a reason for rejection.",
                variant: "destructive",
            });
            return;
        }

        try {
            let obj = {
                "adminId": adminId,
                "approve": false,
                "comments": rejectionReason
            }
            const response = await processPortalUnlockRequest(requestId, obj);
            fetchPortalRequests();
            toast({
                title: "Request Rejected",
                description: "Portal unlock request has been rejected.",
            });

            setIsViewDialogOpen(false);
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast({
                title: "Rejection Failed",
                description: "Failed to reject the request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleBulkApprove = async (requestIds: number[]) => {
        try {
            const response = await fetch("/api/admin/portal-requests/bulk-approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestIds,
                    approvedBy: adminId,
                    approvedByName: adminName,
                    approvedDate: new Date().toISOString()
                })
            });

            if (response.ok) {
                // setRequests(prev => prev.map(req => 
                //   requestIds.includes(req.id) 
                //     ? { 
                //         ...req, 
                //         status: "approved", 
                //         approvedBy: adminId, 
                //         approvedByName: adminName,
                //         approvedDate: new Date().toISOString()
                //       }
                //     : req
                // ));

                toast({
                    title: "Bulk Approval Complete",
                    description: `${requestIds.length} requests have been approved.`,
                });
            }
        } catch (error) {
            console.error("Error bulk approving requests:", error);
            toast({
                title: "Bulk Approval Failed",
                description: "Failed to approve requests in bulk.",
                variant: "destructive",
            });
        }
    };

    /* ---------------- MOCK DATA GENERATOR ---------------- */

    const generateMockRequests = (): PortalUnlockRequest[] => {
        return [
            {
                id: 1,
                userType: "FIELD_EXECUTIVE",
                lockedDate: "2024-01-15T10:30:00",
                reason: "Need to access portal for urgent visit planning. My account got locked after multiple attempts.",
                status: "PENDING",
                requestedAt: "2024-01-16T09:00:00",
                reviewedAt: null,
                adminComments: null,
                manager: null,
                fieldExecutive: {
                    id: 101,
                    name: "John Smith",
                    email: "john.smith@company.com",
                    phone: "+1 234-567-8901",
                    employeeCode: "FE001",
                    territory: "North Zone",
                    region: "Delhi",
                    managerName: "Robert Brown",
                    managerId: 301,
                    markets: ["Market A", "Market B"]

                }
            },

            {
                id: 1,
                userType: "Manager",
                lockedDate: "2024-01-15T10:30:00",
                reason: "Need to access portal for urgent visit planning. My account got locked after multiple attempts.",
                status: "PENDING",
                requestedAt: "2024-01-16T09:00:00",
                reviewedAt: null,
                adminComments: null,
                manager: {
                    id: 301,
                    name: "Robert Brown",
                    email: "robert.brown@company.com",
                    phone: "+1 987-654-3210",
                    employeeCode: "MGR001",
                    department: "Sales",
                    designation: "Manager",
                },
                fieldExecutive: null
            },
        ];
    };

    /* ---------------- FILTERING & SORTING ---------------- */

    const getFilteredRequests = () => {
        return requests
            .filter(req => {
                // Tab filter
                if (activeTab === "pending") return req.status.toLowerCase() === "pending";
                if (activeTab === "approved") return req.status.toLowerCase() === "approved";
                if (activeTab === "rejected") return req.status.toLowerCase() === "rejected";
                return true;
            })
            .filter(req => {
                // Search filter
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();
                return (
                    req.manager?.name.toLowerCase().includes(term) ||
                    req.fieldExecutive?.name.toLowerCase().includes(term) ||
                    req.manager?.email.toLowerCase().includes(term) ||
                    req.fieldExecutive?.email.toLowerCase().includes(term) ||
                    req.manager?.employeeCode.toLowerCase().includes(term) ||
                    req.fieldExecutive?.employeeCode.toLowerCase().includes(term) ||
                    req.reason.toLowerCase().includes(term)
                );
            })
            .filter(req => {
                // User type filter
                if (userTypeFilter === "all") return true;
                return req.userType === userTypeFilter;
            })
            // .filter(req => {
            //     // Priority filter
            //     if (priorityFilter === "all") return true;
            //     return req.priority === priorityFilter;
            // })
            .filter(req => {
                // Date range filter
                if (!dateRange.from && !dateRange.to) return true;
                const requestDate = new Date(req.lockedDate);
                if (dateRange.from && requestDate < new Date(dateRange.from)) return false;
                if (dateRange.to && requestDate > new Date(dateRange.to)) return false;
                return true;
            })
            .sort((a, b) => {
                // Sort by priority then date
                // const priorityWeight = { high: 3, medium: 2, low: 1 };
                // const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
                // if (priorityDiff !== 0) return priorityDiff;
                return new Date(b.lockedDate).getTime() - new Date(a.lockedDate).getTime();
            });
    };

    const getRequestStats = (): RequestStats => {
        return {
            total: requests.length,
            pending: requests.filter(r => r.status.toLowerCase() === "pending").length,
            approved: requests.filter(r => r.status.toLowerCase() === "approved").length,
            rejected: requests.filter(r => r.status.toLowerCase() === "rejected").length,
            //   highPriority: requests.filter(r => r.priority === "high" && r.status === "pending").length
        };
    };

    const stats = getRequestStats();
    const filteredRequests = getFilteredRequests();

    /* ---------------- UI COMPONENTS ---------------- */

    const StatusBadge = ({ status }: { status: string }) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            approved: "bg-green-100 text-green-800 border-green-300",
            rejected: "bg-red-100 text-red-800 border-red-300"
        };

        return (
            <Badge variant="outline" className={`${variants[status as keyof typeof variants]} font-medium`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const variants = {
            high: "bg-red-100 text-red-800 border-red-300",
            medium: "bg-orange-100 text-orange-800 border-orange-300",
            low: "bg-blue-100 text-blue-800 border-blue-300"
        };

        return (
            <Badge variant="outline" className={`${variants[priority as keyof typeof variants]} font-medium`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    const UserTypeBadge = ({ userType }: { userType: string }) => {
        return (
            <Badge
                className={userType.toLowerCase() === "manager"
                    ? "bg-purple-100 text-purple-800 border-purple-300"
                    : "bg-blue-100 text-blue-800 border-blue-300"
                }
                variant="outline"
            >
                {userType.toLowerCase() === "manager" ? "Manager" : "Field Executive"}
            </Badge>
        );
    };

    const RequestCard = ({ request }: { request: PortalUnlockRequest }) => {
        return (
            <Card className="mb-4 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className={`
                  p-3 rounded-full
                  ${request.userType.toLowerCase() === "manager" ? "bg-purple-100" : "bg-blue-100"}
                `}>
                                    {request.userType.toLowerCase() === "manager"
                                        ? <Briefcase className="h-5 w-5 text-purple-600" />
                                        : <User className="h-5 w-5 text-blue-600" />
                                    }
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{request.fieldExecutive?.name || request.manager?.name}</h3>
                                        <UserTypeBadge userType={request.userType} />
                                        <StatusBadge status={request.status} />
                                        {/* <PriorityBadge priority={request.priority} /> */}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-muted-foreground flex items-center">
                                            <Hash className="h-3.5 w-3.5 mr-1" />
                                            {request.manager?.employeeCode || request.fieldExecutive?.employeeCode}
                                        </span>
                                        {/* <span className="text-sm text-muted-foreground">{request.role}</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(request.requestedAt).toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Request ID: #{request.id}
                                </p>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-1">Reason for Request:</p>
                            <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{request.manager?.email || request.fieldExecutive?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{request.manager?.phone || request.fieldExecutive?.phone}</span>
                            </div>
                            {/* {request.territory && request.region && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{request.territory}, {request.region}</span>
                                </div>
                            )} */}
                        </div>

                        {/* Actions */}
                        <div className="border-t pt-4 flex justify-end gap-2">
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedRequest(request);
                                    setIsViewDialogOpen(true);
                                }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Button> */}
                            {request.status.toLowerCase() === "pending" && (
                                <>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApproveRequest(request.id)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setIsRejectDialogOpen(true);
                                        }}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Approval/Rejection Info */}
                        {request.status.toLowerCase() !== "pending" && (
                            <div className={`
                border-t pt-4 text-sm
                ${request.status.toLowerCase() === "approved" ? "text-green-600" : "text-red-600"}
              `}>
                                <div className="flex items-center justify-between">
                                    <span>
                                        {request.status.toLowerCase() === "approved" ? "Approved" : "Rejected"} by Admin
                                    </span>
                                    <span>{new Date(request.reviewedAt!).toLocaleString()}</span>
                                </div>
                                {request.adminComments && (
                                    <p className="text-muted-foreground mt-1">
                                        Reason: {request.adminComments}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    /* ---------------- MAIN RENDER ---------------- */

    return (
        <div className="h-screen bg-background flex w-full overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">Portal Unlock Requests</h1>
                                <p className="text-muted-foreground">
                                    Manage and process portal access requests from Field Executives and Managers
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={fetchPortalRequests}
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                {/* <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button> */}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Approved</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCheck className="h-5 w-5 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                    </div>
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <X className="h-5 w-5 text-red-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-700">High Priority</p>
                    <p className="text-2xl font-bold text-red-700">{stats.highPriority}</p>
                  </div>
                  <div className="p-2 bg-red-200 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-700" />
                  </div>
                </CardContent>
              </Card> */}
                        </div>

                        {/* Main Content Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Management</CardTitle>
                                <CardDescription>
                                    Review and process portal unlock requests. Approve or reject based on verification.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Filters */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by name, email, code or reason..."
                                                className="pl-8"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="User Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            <SelectItem value="field_executive">Field Executives</SelectItem>
                                            <SelectItem value="manager">Managers</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select> */}
                                </div>

                                {/* Tabs */}
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="all">
                                            All
                                            <Badge variant="secondary" className="ml-2">
                                                {stats.total}
                                            </Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="pending">
                                            Pending
                                            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                                                {stats.pending}
                                            </Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="approved">
                                            Approved
                                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                                                {stats.approved}
                                            </Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="rejected">
                                            Rejected
                                            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                                                {stats.rejected}
                                            </Badge>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value={activeTab} className="mt-6">
                                        {isLoading ? (
                                            <div className="space-y-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="space-y-2">
                                                        <Skeleton className="h-8 w-48" />
                                                        <Skeleton className="h-32 w-full" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : filteredRequests.length > 0 ? (
                                            <div className="space-y-4">
                                                {filteredRequests.map((request) => (
                                                    <RequestCard key={request.id} request={request} />
                                                ))}
                                            </div>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>No requests found</AlertTitle>
                                                <AlertDescription>
                                                    There are no {activeTab !== "all" ? activeTab : ""} portal unlock requests matching your filters.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Reject Request Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Portal Unlock Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this request? Please provide a reason for rejection.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">
                            Rejection Reason
                        </label>
                        <textarea
                            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter the reason for rejecting this request..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                setRejectionReason("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedRequest && handleRejectRequest(selectedRequest.id)}
                            disabled={!rejectionReason.trim()}
                        >
                            Reject Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}