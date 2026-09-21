import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Header from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, UserCog } from "lucide-react";
import {
    fetchAllZsmFeRequests,
    reviewZsmFeRequest,
    fetchAllManagerFeRequests,
    reviewManagerFeRequest,
} from "@/services/AdminSlotService";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { fetchAllSlotPlanDayRequests, reviewSlotPlanDayRequest } from "@/services/AdminSlotService";

interface SlotPlanDayRequest {
    id: number;
    reason: string;
    requestedManagerId: number | null;
    requestedManagerName: string | null;
    requestedZsmId: number | null;
    requestedZsmName: string | null;
    requestedFieldExecutiveId: number | null;
    requestedFieldExecutiveName: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    requestedAt: string;
    reviewedAt: string | null;
    adminNotes: string | null;
}

interface ZsmFeRequest {
    requestId: number;
    zsmId: number;
    zsmName: string;

    requestedFeId: number;
    requestedFeName: string;
    requestedFeEmpCode: string;

    currentFeId: number | null;
    currentFeName: string | null;

    weekNumber: number;
    dayOfWeek: number;
    targetDate: string;

    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    adminRemarks: string | null;

    reviewedByName: string | null;
    reviewedAt: string | null;
    createdAt: string;
}

interface ManagerFeRequest {
    requestId: number;
    managerId: number;
    managerName: string;

    requestedFeId: number;
    requestedFeName: string;
    requestedFeEmpCode: string;

    currentFeId: number | null;
    currentFeName: string | null;

    weekNumber: number;
    dayOfWeek: number;
    targetDate: string;

    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    adminRemarks: string | null;

    reviewedByName: string | null;
    reviewedAt: string | null;
    createdAt: string;
}



const statusConfig = {
    PENDING: { label: "Pending", icon: Clock, variant: "outline" as const, className: "bg-amber-100 text-amber-800 border-amber-300" },
    APPROVED: { label: "Approved", icon: CheckCircle2, variant: "outline" as const, className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    REJECTED: { label: "Rejected", icon: XCircle, variant: "outline" as const, className: "bg-red-100 text-red-800 border-red-300" },
};

export default function AdminSlotPlanDayRequests() {
    const { toast } = useToast();
    const [requests, setRequests] = useState<SlotPlanDayRequest[]>([]);
    const [actionModal, setActionModal] = useState<{ type: "approve" | "reject"; request: SlotPlanDayRequest } | null>(null);
    const [adminNotes, setAdminNotes] = useState("");

    const pendingRequests = requests.filter((r) => r.status === "PENDING");
    const processedRequests = requests.filter((r) => r.status !== "PENDING");

    const [feRequests, setFeRequests] = useState<ZsmFeRequest[]>([]);
    const [feActionModal, setFeActionModal] = useState<{
        type: "approve" | "reject";
        request: ZsmFeRequest;
    } | null>(null);
    const [feAdminNotes, setFeAdminNotes] = useState("");

    const pendingFeRequests = feRequests.filter((r) => r.status === "PENDING");
    const processedFeRequests = feRequests.filter((r) => r.status !== "PENDING");


    const [mgrFeRequests, setMgrFeRequests] = useState<ManagerFeRequest[]>([]);
    const [mgrFeActionModal, setMgrFeActionModal] = useState<{
        type: "approve" | "reject";
        request: ManagerFeRequest;
    } | null>(null);
    const [mgrFeAdminNotes, setMgrFeAdminNotes] = useState("");

    const pendingMgrFeRequests = mgrFeRequests.filter((r) => r.status === "PENDING");
    const processedMgrFeRequests = mgrFeRequests.filter((r) => r.status !== "PENDING");

    useEffect(() => {
        fetchRequests();
        fetchFeRequests();
        fetchManagerFeRequests();
    }, []);

    const fetchRequests = async () => {
        const response = await fetchAllSlotPlanDayRequests();
        setRequests(response);
    }

    const fetchFeRequests = async () => {
        try {
            const response = await fetchAllZsmFeRequests();
            setFeRequests(response);
        } catch (error) {
            toast({
                title: "Failed to load FE requests",
                description: "Could not fetch field executive change requests.",
                variant: "destructive",
            });
        }
    };

    const fetchManagerFeRequests = async () => {
        try {
            const response = await fetchAllManagerFeRequests();
            setMgrFeRequests(response);
        } catch (error) {
            toast({
                title: "Failed to load Manager FE requests",
                description: "Could not fetch manager FE change requests.",
                variant: "destructive",
            });
        }
    };

    const handleFeAction = async () => {
        try {
            if (!feActionModal) return;
            const { type, request } = feActionModal;
            const newStatus = type === "approve" ? "APPROVED" : "REJECTED";
            const adminId = Number(sessionStorage.getItem("userID"));

            await reviewZsmFeRequest({
                requestId: request.requestId,
                adminId,
                adminRemarks: feAdminNotes || null,
                action: type,   // ← pass the action explicitly
            });

            fetchFeRequests();

            toast({
                title: type === "approve" ? "Request Approved" : "Request Rejected",
                description:
                    type === "approve"
                        ? `${request.requestedFeName} has been assigned to ${request.zsmName} for Week ${request.weekNumber}, Day ${request.dayOfWeek}.`
                        : `Request from ${request.zsmName} has been rejected.`,
            });

            setFeActionModal(null);
            setFeAdminNotes("");
        } catch (error: any) {
            toast({
                title: "Failed to update request",
                description:
                    error?.response?.data?.message ||
                    "An error occurred while updating the FE request.",
                variant: "destructive",
            });
            setFeActionModal(null);
            setFeAdminNotes("");
        }
    };

    const handleMgrFeAction = async () => {
        try {
            if (!mgrFeActionModal) return;
            const { type, request } = mgrFeActionModal;
            const adminId = Number(sessionStorage.getItem("userID"));

            await reviewManagerFeRequest({
                requestId: request.requestId,
                adminId,
                adminRemarks: mgrFeAdminNotes || null,
                action: type,
            });

            fetchManagerFeRequests();

            toast({
                title: type === "approve" ? "Request Approved" : "Request Rejected",
                description:
                    type === "approve"
                        ? `${request.requestedFeName} has been assigned to ${request.managerName} for Week ${request.weekNumber}, Day ${request.dayOfWeek}.`
                        : `Request from ${request.managerName} has been rejected.`,
            });

            setMgrFeActionModal(null);
            setMgrFeAdminNotes("");
        } catch (error: any) {
            toast({
                title: "Failed to update request",
                description:
                    error?.response?.data?.message ||
                    "An error occurred while updating the Manager FE request.",
                variant: "destructive",
            });
            setMgrFeActionModal(null);
            setMgrFeAdminNotes("");
        }
    };

    const getRequesterInfo = (req: SlotPlanDayRequest) => {
        if (req.requestedFieldExecutiveName) {
            return { name: req.requestedFieldExecutiveName, role: "Field Executive" };
        }
        if (req.requestedZsmName) {
            return { name: req.requestedZsmName, role: "ZSM" };
        }
        return { name: req.requestedManagerName ?? "Unknown", role: "Manager" };
    };

    const handleAction = async () => {
        try {
            if (!actionModal) return;
            const { type, request } = actionModal;
            const newStatus = type === "approve" ? "APPROVED" : "REJECTED";
            let requestId = request.id;
            let adminId = sessionStorage.getItem("userID");
            let obj = {
                status: newStatus,
                adminNotes: adminNotes || null,
            };
            const response = await reviewSlotPlanDayRequest(requestId, Number(adminId), obj);
            fetchRequests();

            toast({
                title: type === "approve" ? "Request Approved" : "Request Rejected",
                description: `Slot plan day request from ${getRequesterInfo(request).name} has been ${newStatus.toLowerCase()}.`,
            });

            setActionModal(null);
            setAdminNotes("");

        } catch (error) {
            toast({
                title: "Failed to update request",
                description: `An error occurred while updating the slot plan day request.`,
            });

            setActionModal(null);
            setAdminNotes("");
        }
    };

    return (
        <div className="h-screen bg-background flex w-full overflow-hidden">
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
                                <h1 className="text-2xl font-bold text-white">Slot Planning Requests</h1>
                            </div>
                            <p className="text-white/80 ml-14">
                                Review and manage slot plan day and field executive change requests
                            </p>
                        </div>

                        <Tabs defaultValue="slot-plan-day" className="w-full">
                            <TabsList className="grid w-full max-w-2xl grid-cols-3">
                                <TabsTrigger value="slot-plan-day" className="flex items-center gap-2">
                                    <CalendarCheck className="h-4 w-4" />
                                    Slot Plan Day
                                    {pendingRequests.length > 0 && (
                                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                                            {pendingRequests.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="field-executive" className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    ZSM FE Requests
                                    {pendingFeRequests.length > 0 && (
                                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                                            {pendingFeRequests.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="manager-field-executive" className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    Manager FE Requests
                                    {pendingMgrFeRequests.length > 0 && (
                                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                                            {pendingMgrFeRequests.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            {/* ============ TAB 1: Slot Plan Day ============ */}
                            <TabsContent value="slot-plan-day" className="space-y-6 mt-4">
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
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                No pending requests
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {pendingRequests.map((req) => (
                                                    <RequestCard
                                                        key={req.id}
                                                        request={req}
                                                        onApprove={() => {
                                                            setActionModal({ type: "approve", request: req });
                                                            setAdminNotes("");
                                                        }}
                                                        onReject={() => {
                                                            setActionModal({ type: "reject", request: req });
                                                            setAdminNotes("");
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

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
                            </TabsContent>

                            {/* ============ TAB 2: Field Executive Change Requests ============ */}
                            <TabsContent value="field-executive" className="space-y-6 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            Pending FE Change Requests
                                            {pendingFeRequests.length > 0 && (
                                                <Badge variant="destructive">{pendingFeRequests.length}</Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {pendingFeRequests.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                No pending FE change requests
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {pendingFeRequests.map((req) => (
                                                    <FeRequestCard
                                                        key={req.requestId}
                                                        request={req}
                                                        onApprove={() => {
                                                            setFeActionModal({ type: "approve", request: req });
                                                            setFeAdminNotes("");
                                                        }}
                                                        onReject={() => {
                                                            setFeActionModal({ type: "reject", request: req });
                                                            setFeAdminNotes("");
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {processedFeRequests.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Processed FE Requests</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {processedFeRequests.map((req) => (
                                                    <FeRequestCard key={req.requestId} request={req} />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                            {/* ============ TAB 3: Manager FE Change Requests ============ */}
                            <TabsContent value="manager-field-executive" className="space-y-6 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            Pending Manager FE Change Requests
                                            {pendingMgrFeRequests.length > 0 && (
                                                <Badge variant="destructive">{pendingMgrFeRequests.length}</Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {pendingMgrFeRequests.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                No pending Manager FE change requests
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {pendingMgrFeRequests.map((req) => (
                                                    <ManagerFeRequestCard
                                                        key={req.requestId}
                                                        request={req}
                                                        onApprove={() => {
                                                            setMgrFeActionModal({ type: "approve", request: req });
                                                            setMgrFeAdminNotes("");
                                                        }}
                                                        onReject={() => {
                                                            setMgrFeActionModal({ type: "reject", request: req });
                                                            setMgrFeAdminNotes("");
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {processedMgrFeRequests.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Processed Manager FE Requests</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {processedMgrFeRequests.map((req) => (
                                                    <ManagerFeRequestCard key={req.requestId} request={req} />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
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

            {/* Approve / Reject FE Request Modal */}
            <Dialog
                open={!!feActionModal}
                onOpenChange={(open) => {
                    if (!open) setFeActionModal(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {feActionModal?.type === "approve"
                                ? "Approve FE Change Request"
                                : "Reject FE Change Request"}
                        </DialogTitle>
                    </DialogHeader>

                    {feActionModal && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {feActionModal.type === "approve"
                                    ? "Approving this will unassign the current FE's visits for this slot and assign them to the new FE. Continue?"
                                    : "Are you sure you want to reject this FE change request?"}
                            </p>

                            <div className="text-sm border rounded-lg p-3 bg-muted/50 space-y-1.5">
                                <p>
                                    <span className="font-medium">ZSM:</span>{" "}
                                    {feActionModal.request.zsmName}
                                </p>
                                <p>
                                    <span className="font-medium">Current FE:</span>{" "}
                                    {feActionModal.request.currentFeName || "None"}
                                </p>
                                <p>
                                    <span className="font-medium">Requested FE:</span>{" "}
                                    {feActionModal.request.requestedFeName} (
                                    {feActionModal.request.requestedFeEmpCode})
                                </p>
                                <p>
                                    <span className="font-medium">Slot:</span> Week{" "}
                                    {feActionModal.request.weekNumber}, Day{" "}
                                    {feActionModal.request.dayOfWeek}
                                </p>
                                <p>
                                    <span className="font-medium">Reason:</span>{" "}
                                    {feActionModal.request.reason}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Admin Notes (optional)
                                </label>
                                <Textarea
                                    placeholder="Add notes..."
                                    value={feAdminNotes}
                                    onChange={(e) => setFeAdminNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFeActionModal(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant={feActionModal?.type === "approve" ? "default" : "destructive"}
                            onClick={handleFeAction}
                        >
                            {feActionModal?.type === "approve" ? "Approve" : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve / Reject Manager FE Request Modal */}
            <Dialog
                open={!!mgrFeActionModal}
                onOpenChange={(open) => {
                    if (!open) setMgrFeActionModal(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {mgrFeActionModal?.type === "approve"
                                ? "Approve Manager FE Change Request"
                                : "Reject Manager FE Change Request"}
                        </DialogTitle>
                    </DialogHeader>

                    {mgrFeActionModal && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {mgrFeActionModal.type === "approve"
                                    ? "Approving this will unassign the current FE's visits for this slot and assign them to the new FE. Continue?"
                                    : "Are you sure you want to reject this Manager FE change request?"}
                            </p>

                            <div className="text-sm border rounded-lg p-3 bg-muted/50 space-y-1.5">
                                <p>
                                    <span className="font-medium">Manager:</span>{" "}
                                    {mgrFeActionModal.request.managerName}
                                </p>
                                <p>
                                    <span className="font-medium">Current FE:</span>{" "}
                                    {mgrFeActionModal.request.currentFeName || "None"}
                                </p>
                                <p>
                                    <span className="font-medium">Requested FE:</span>{" "}
                                    {mgrFeActionModal.request.requestedFeName} (
                                    {mgrFeActionModal.request.requestedFeEmpCode})
                                </p>
                                <p>
                                    <span className="font-medium">Slot:</span> Week{" "}
                                    {mgrFeActionModal.request.weekNumber}, Day{" "}
                                    {mgrFeActionModal.request.dayOfWeek}
                                </p>
                                <p>
                                    <span className="font-medium">Reason:</span>{" "}
                                    {mgrFeActionModal.request.reason}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Admin Notes (optional)
                                </label>
                                <Textarea
                                    placeholder="Add notes..."
                                    value={mgrFeAdminNotes}
                                    onChange={(e) => setMgrFeAdminNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMgrFeActionModal(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant={mgrFeActionModal?.type === "approve" ? "default" : "destructive"}
                            onClick={handleMgrFeAction}
                        >
                            {mgrFeActionModal?.type === "approve" ? "Approve" : "Reject"}
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
    const requesterName = request.requestedFieldExecutiveName ?? request.requestedManagerName ?? request.requestedZsmName ?? "Unknown";
    const requesterRole = request.requestedFieldExecutiveId ? "Field Executive" : request.requestedZsmId ? "ZSM" : "Manager";
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


function FeRequestCard({
    request,
    onApprove,
    onReject,
}: {
    request: ZsmFeRequest;
    onApprove?: () => void;
    onReject?: () => void;
}) {
    const config = statusConfig[request.status as keyof typeof statusConfig]
        ?? statusConfig.PENDING;

    return (
        <div className="border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        Request by {request.zsmName}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">ZSM</Badge>
                </div>
                <Badge variant={config.variant} className={config.className}>
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                </Badge>
            </div>

            {/* Assignment change summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-700 mb-1">Current FE</p>
                    <p className="font-medium">
                        {request.currentFeName || "—"}
                    </p>
                    {!request.currentFeName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            No FE currently assigned
                        </p>
                    )}
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-emerald-700 mb-1">
                        Requested New FE
                    </p>
                    <p className="font-medium">{request.requestedFeName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {request.requestedFeEmpCode}
                    </p>
                </div>
            </div>

            {/* Slot info */}
            <div className="text-sm text-muted-foreground space-y-1">
                <p>
                    <span className="font-medium text-foreground">Slot:</span>{" "}
                    Week {request.weekNumber}, Day {request.dayOfWeek}
                    <span className="ml-2 text-xs">
                        ({new Date(request.targetDate).toLocaleDateString()})
                    </span>
                </p>
                <p>
                    <span className="font-medium text-foreground">Reason:</span>{" "}
                    {request.reason}
                </p>
                <p>
                    <span className="font-medium text-foreground">Requested:</span>{" "}
                    {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.reviewedAt && (
                    <p>
                        <span className="font-medium text-foreground">Reviewed:</span>{" "}
                        {new Date(request.reviewedAt).toLocaleString()}
                        {request.reviewedByName && ` by ${request.reviewedByName}`}
                    </p>
                )}
                {request.adminRemarks && (
                    <p>
                        <span className="font-medium text-foreground">Admin Notes:</span>{" "}
                        {request.adminRemarks}
                    </p>
                )}
            </div>

            {/* Actions */}
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


function ManagerFeRequestCard({
    request,
    onApprove,
    onReject,
}: {
    request: ManagerFeRequest;
    onApprove?: () => void;
    onReject?: () => void;
}) {
    const config = statusConfig[request.status as keyof typeof statusConfig]
        ?? statusConfig.PENDING;

    return (
        <div className="border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        Request by {request.managerName}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">Manager</Badge>
                </div>
                <Badge variant={config.variant} className={config.className}>
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                </Badge>
            </div>

            {/* Assignment change summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-700 mb-1">Current FE</p>
                    <p className="font-medium">
                        {request.currentFeName || "—"}
                    </p>
                    {!request.currentFeName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            No FE currently assigned
                        </p>
                    )}
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-emerald-700 mb-1">
                        Requested New FE
                    </p>
                    <p className="font-medium">{request.requestedFeName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {request.requestedFeEmpCode}
                    </p>
                </div>
            </div>

            {/* Slot info */}
            <div className="text-sm text-muted-foreground space-y-1">
                <p>
                    <span className="font-medium text-foreground">Slot:</span>{" "}
                    Week {request.weekNumber}, Day {request.dayOfWeek}
                    <span className="ml-2 text-xs">
                        ({new Date(request.targetDate).toLocaleDateString()})
                    </span>
                </p>
                <p>
                    <span className="font-medium text-foreground">Reason:</span>{" "}
                    {request.reason}
                </p>
                <p>
                    <span className="font-medium text-foreground">Requested:</span>{" "}
                    {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.reviewedAt && (
                    <p>
                        <span className="font-medium text-foreground">Reviewed:</span>{" "}
                        {new Date(request.reviewedAt).toLocaleString()}
                        {request.reviewedByName && ` by ${request.reviewedByName}`}
                    </p>
                )}
                {request.adminRemarks && (
                    <p>
                        <span className="font-medium text-foreground">Admin Notes:</span>{" "}
                        {request.adminRemarks}
                    </p>
                )}
            </div>

            {/* Actions */}
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
