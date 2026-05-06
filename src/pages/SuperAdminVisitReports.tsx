import { useState, useMemo, useEffect } from "react";
import { ClipboardList, Search, CalendarIcon, User, AlertTriangle, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format } from "date-fns";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fetchFEs } from "@/services/FEService";
import { fetchManagerInfos } from "@/services/ManagerService";
import { exportFeVisits, fetchFEVisitReport } from "@/services/VisitService";
import { fetchManagerVisitReport } from "@/services/ManagerVisitService";
import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";

type UserType = "field_executive" | "manager";

interface UserOption {
    id: number;
    name: string;
    employeeCode: string;
    territory: string;
}

interface Visit {
    id: number;
    visitId: string;
    doctorName: string;
    pharmacyName: string;
    fieldExecutiveName: string;
    category: string;
    practiceType: string;
    visitDate: string;
    status: "Completed" | "Missed" | "Pending";
}

const defaultVisitReport = {
    completedVisitCount: 0,
    missedVisitCount: 0,
    pendingVisitCount: 0,
    // completedAPlusVisits: 0,
    // completedAVisits: 0,
    // completedBVisits: 0,
    // completedDoctorVisitCount: 0,
    // completedVisitCount: 0,
    // missedAPlusVisits: 0,
    // missedAVisits: 0,
    // missedBVisits: 0,
    // missedDoctorVisitCount: 0,
    // missedVisitCount: 0,
    // completedPharmacistVisitCount: 0,
    // missedPharmacistVisitCount: 0,
    visits: [] as Visit[],
};

const SuperAdminVisitReports = () => {
    const [userType, setUserType] = useState<UserType>("field_executive");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userSearch, setUserSearch] = useState("");
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [fieldExecutives, setFieldExecutives] = useState<any[]>([]);
    const [managers, setManagers] = useState<any[]>([]);
    const [visitReports, setVisitReports] = useState(defaultVisitReport);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    useEffect(() => {
        getAllFieldExecutives();
        getAllManagers();
    }, []);

    // useEffect(() => {
    //     if (selectedUserId && fromDate && toDate ) {
    //         const formattedFromDate = formatDate(fromDate);
    //         const formattedToDate = formatDate(toDate);

    //         if (userType === "field_executive") {
    //             fetchFEVisitReport(selectedUserId, formattedFromDate, formattedToDate)
    //                 .then((data) => {
    //                     setVisitReports(data);
    //                     // Assuming the API returns visits array in the response
    //                     setVisits(data.visits || []);
    //                 })
    //                 .catch((error) => {
    //                     console.error("Error fetching visit report:", error);
    //                     setVisitReports(defaultVisitReport);
    //                     setVisits([]);
    //                 });
    //         } else {
    //             fetchManagerVisitReport(selectedUserId, formattedFromDate, formattedToDate)
    //                 .then((data) => {
    //                     setVisitReports(data);
    //                     setVisits(data.visits || []);
    //                 })
    //                 .catch((error) => {
    //                     console.error("Error fetching visit report:", error);
    //                     setVisitReports(defaultVisitReport);
    //                     setVisits([]);
    //                 });
    //         }
    //     }
    // }, [selectedUserId, fromDate, toDate]);

    const apply = async () => {
        if (selectedUserId && fromDate && toDate && statusFilter) {
            const formattedFromDate = formatDate(fromDate);
            const formattedToDate = formatDate(toDate);

            if (userType === "field_executive") {
                fetchFEVisitReport(selectedUserId, formattedFromDate.trim(), formattedToDate.trim(), statusFilter, categoryFilter)
                    .then((data) => {
                        setVisitReports(data);
                        // Assuming the API returns visits array in the response
                        setVisits(data.visits || []);
                    })
                    .catch((error) => {
                        console.error("Error fetching visit report:", error);
                        setVisitReports(defaultVisitReport);
                        setVisits([]);
                    });
            } else {

                fetchManagerVisitReport(selectedUserId, formattedFromDate, formattedToDate, statusFilter, categoryFilter)
                    .then((data) => {
                        setVisitReports(data);
                        setVisits(data.visits || []);
                        console.log("manager visits", visits)
                    })
                    .catch((error) => {
                        console.error("Error fetching visit report:", error);
                        setVisitReports(defaultVisitReport);
                        setVisits([]);
                    });
            }
        }
    }

    const handleExportFeVisits = async () => {
        try {
            let obj = {
                "startDate": formatDateLocal(fromDate),
                "endDate": formatDateLocal(toDate),
                "fieldExecutiveId": selectedUserId,
                "visitStatus": statusFilter === "all" ? null : statusFilter,
                "category": categoryFilter === "all" ? null : categoryFilter
            }
            const response = await exportFeVisits(obj)
            // const blob = await response.blob();
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `visits_report_${selectedUser.name}_${formatDate(fromDate)}_${formatDate(toDate)}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading file", error);
        }
    }
    const handleExportManagerVisits = async () => {
        try {
            let obj = {
                "startDate": formatDateLocal(fromDate),
                "endDate": formatDateLocal(toDate),
                "managerId": selectedUserId,
                "visitStatus": statusFilter === "all" ? null : statusFilter,
                "category": categoryFilter === "all" ? null : categoryFilter
            }
            const response = await exportFeVisits(obj)

            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `visits_report_${selectedUser.name}_${formatDate(fromDate)}_${formatDate(toDate)}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading file", error);
        }

    }

    const handleExport = async () => {
        if (userType === "field_executive") {
            handleExportFeVisits();
        } else {
            handleExportManagerVisits();
        }
    }

    const formatDateLocal = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    const getAllFieldExecutives = async () => {
        try {
            const response = await fetchFEs();
            setFieldExecutives(response);
        } catch (error) {
            console.error("Error fetching field executives:", error);
        }
    }

    const getAllManagers = async () => {
        try {
            const response = await fetchManagerInfos();
            setManagers(response);
        } catch (error) {
            console.error("Error fetching managers:", error);
        }
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const users = userType === "field_executive" ? fieldExecutives : managers;

    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return users;
        const q = userSearch.toLowerCase();
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.employeeCode.toLowerCase().includes(q)
        );
    }, [users, userSearch]);

    const selectedUser = users.find((u) => u.id === selectedUserId);

    // Filter visits by status and category
    const filteredVisits = useMemo(() => {
        if (statusFilter === "all") return visits;
        return visits.filter((v) => v.status === statusFilter && v.category === categoryFilter);
    }, [visits, statusFilter, categoryFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
    const paginatedVisits = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredVisits.slice(startIndex, endIndex);
    }, [filteredVisits, currentPage, itemsPerPage]);

    const handleUserTypeChange = (type: UserType) => {
        setUserType(type);
        setSelectedUserId(null);
        setUserSearch("");
        setFromDate(undefined);
        setToDate(undefined);
        setStatusFilter("all");
        setCurrentPage(1);
        setVisitReports(defaultVisitReport);
        setVisits([]);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "Missed":
                return "bg-red-100 text-red-700 border-red-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="h-screen bg-background flex overflow-hidden">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Page Header */}
                    <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <ClipboardList className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Visit Reports</h1>
                        </div>
                        <p className="text-white/80 ml-14">
                            View visit reports of Field Executives and Managers
                        </p>
                    </div>

                    {/* User Type Selector */}
                    <div className="animate-fade-in flex gap-3">
                        <Button
                            variant={userType === "field_executive" ? "default" : "outline"}
                            onClick={() => handleUserTypeChange("field_executive")}
                            className="min-w-[160px]"
                        >
                            Field Executive
                        </Button>
                        <Button
                            variant={userType === "manager" ? "default" : "outline"}
                            onClick={() => handleUserTypeChange("manager")}
                            className="min-w-[160px]"
                        >
                            Manager
                        </Button>
                    </div>

                    {/* User List with Search */}
                    <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Select {userType === "field_executive" ? "Field Executive" : "Manager"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or employee code..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                                {filteredUsers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setFromDate(undefined);
                                                setToDate(undefined);
                                                setStatusFilter("all");
                                                setCurrentPage(1);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                                selectedUserId === user.id
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                    : "border-border hover:border-primary/30 hover:bg-accent"
                                            )}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">{user.employeeCode}</span>
                                                    <span className="text-xs text-muted-foreground truncate">{user.territory}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date Pickers & Visit Table — only if user selected */}
                    {selectedUser && (
                        <>
                            {/* Filters Section */}
                            <div className="animate-fade-in space-y-3" style={{ animationDelay: "0.15s" }}>
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-sm">From Date</Label>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={fromDate}
                                                        onSelect={setFromDate}
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm">To Date</Label>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {toDate ? format(toDate, "PPP") : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={toDate}
                                                        onSelect={setToDate}
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="MISSED">Missed</SelectItem>
                                                <SelectItem value="SCHEDULED">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm">Category</Label>
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="A_PLUS">A+</SelectItem>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                apply();
                                            }}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Apply
                                        </Button>
                                        {(fromDate || toDate || statusFilter !== "all" || categoryFilter !== "all") && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setFromDate(undefined);
                                                    setToDate(undefined);
                                                    setStatusFilter("all");
                                                    setCategoryFilter("all");
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Summary Stats */}
                            <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ animationDelay: "0.2s" }}>
                                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total Visits</p>
                                                <p className="text-2xl font-bold text-emerald-700">
                                                    {visits.length}
                                                </p>
                                            </div>
                                            <div className="p-2 rounded-full bg-emerald-200/50">
                                                <ClipboardList className="h-5 w-5 text-emerald-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Completed</p>
                                                <p className="text-2xl font-bold text-green-700">
                                                    {visitReports.completedVisitCount}
                                                </p>
                                            </div>
                                            <div className="p-2 rounded-full bg-green-200/50">
                                                <ClipboardList className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Missed</p>
                                                <p className="text-2xl font-bold text-red-700">
                                                    {visitReports.missedVisitCount}
                                                </p>
                                            </div>
                                            <div className="p-2 rounded-full bg-red-200/50">
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Pending</p>
                                                <p className="text-2xl font-bold text-yellow-700">
                                                    {visitReports.pendingVisitCount}
                                                </p>
                                            </div>
                                            <div className="p-2 rounded-full bg-yellow-200/50">
                                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Visit Table */}
                            <Card className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">
                                        Visit Details
                                        {filteredVisits.length > 0 && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                ({filteredVisits.length} {filteredVisits.length === 1 ? 'record' : 'records'})
                                            </span>
                                        )}
                                    </CardTitle>
                                    {filteredVisits.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExport}
                                            className="gap-2"
                                        >
                                            <Download className="h-4 w-4" />
                                            Export
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {paginatedVisits.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                            <p className="text-muted-foreground">No visits found for the selected filters</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">Visit ID</TableHead>
                                                            <TableHead>Doctor Name</TableHead>
                                                            <TableHead>Category</TableHead>
                                                            {userType === "field_executive" && <TableHead>Prescription Type</TableHead>}
                                                            {userType === "manager" && <TableHead>Field Executive</TableHead>}

                                                            <TableHead>Visit Date</TableHead>
                                                            <TableHead className="w-[100px]">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {paginatedVisits.map((visit) => (
                                                            <TableRow key={visit.id} className="hover:bg-muted/50">
                                                                <TableCell className="font-medium">
                                                                    {visit.visitId}
                                                                </TableCell>
                                                                <TableCell>{visit?.doctorName || visit?.pharmacyName}</TableCell>
                                                                <TableCell>{visit?.category}</TableCell>
                                                                {userType === "field_executive" &&
                                                                    <TableCell>{visit?.practiceType}</TableCell>}

                                                                {userType === "manager" && <TableCell>{visit?.fieldExecutiveName}</TableCell>}

                                                                <TableCell>
                                                                    {format(new Date(visit.visitDate), "dd MMM yyyy")}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={cn(
                                                                        "inline-flex px-2 py-1 rounded-full text-xs font-medium border",
                                                                        getStatusColor(visit.status)
                                                                    )}>
                                                                        {visit.status}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                    <div className="text-sm text-muted-foreground">
                                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                                                        {Math.min(currentPage * itemsPerPage, filteredVisits.length)} of{" "}
                                                        {filteredVisits.length} entries
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                            Previous
                                                        </Button>
                                                        <div className="flex gap-1">
                                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                                let pageNum;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                    pageNum = totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }

                                                                return (
                                                                    <Button
                                                                        key={pageNum}
                                                                        variant={currentPage === pageNum ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => setCurrentPage(pageNum)}
                                                                        className="w-9"
                                                                    >
                                                                        {pageNum}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SuperAdminVisitReports;