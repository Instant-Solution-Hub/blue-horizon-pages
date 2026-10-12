import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Doctor, useDoctors } from "@/hooks/useDoctors";
import { FileSpreadsheet, Stethoscope, Users } from "lucide-react";
import { toast } from "sonner";
import { FieldExecutive } from "@/components/admin-user-management/FieldExecutiveList";
import { fetchFieldExecutiveInfos } from "@/services/FEService";
import { fetchDoctorsByFE } from "@/services/DoctorService";
import * as XLSX from "xlsx";

const AdminDoctors = () => {
    const [selectedFE, setSelectedFE] = useState("all");
    const { data: doctors, isLoading, error } = useDoctors();
    const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);

    const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>(doctors ?? []);
    const [isFetchingFEDoctors, setIsFetchingFEDoctors] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (doctors) {
            setDisplayedDoctors(doctors);
        }
    }, [doctors]);

    const fetchData = async () => {
        try {
            const feData = await fetchFieldExecutiveInfos();
            setFieldExecutives(
                feData.map((fe) => ({
                    ...fe,
                    id: String(fe.id),
                    managerId: String(fe.managerId),
                    isPortalLocked: fe.isPortalLocked ?? false,
                }))
            );
        } catch (error) {
            // Handle error
        }
    };

    useEffect(() => {
        if (selectedFE === "all") {
            setDisplayedDoctors(doctors ?? []);
        } else {
            fetchFeDoctors(selectedFE);
        }
    }, [selectedFE, doctors]);

    const fetchFeDoctors = async (feId: string) => {
        try {
            setIsFetchingFEDoctors(true);

            if (feId === "all") {
                setDisplayedDoctors(doctors ?? []);
                return;
            }

            const feDoctors = await fetchDoctorsByFE(Number(feId));
            setDisplayedDoctors(feDoctors);
        } catch (error) {
            console.error("Error fetching FE doctors:", error);
            toast.error("Failed to fetch doctors for this field executive");
            setDisplayedDoctors([]);
        } finally {
            setIsFetchingFEDoctors(false);
        }
    };

    const handleExport = () => {
        const data = displayedDoctors.map((d) => ({
            "Doctor Name": d.name,
            Hospital: d.hospitalName,
            Location: d.location,
            Contact: d.contactNumber,
            "Prescription Type": d.practiceType,
            "Category": d.category,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "My Doctors");
        XLSX.writeFile(wb, `${selectedFE}-doctors.xlsx`);
        toast.success("Doctors exported successfully");
    };

    const showLoading = isLoading || isFetchingFEDoctors;

    return (
        <div className="flex min-h-screen bg-muted/30">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Stethoscope className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                                    Doctors
                                </h1>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    View doctor lists of all field executives
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2 w-full sm:w-auto"
                            onClick={handleExport}
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Export
                        </Button>
                    </div>

                    {/* Field Executive Selector */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">Field Executive:</span>
                        </div>
                        <Select value={selectedFE} onValueChange={setSelectedFE}>
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Select Field Executive" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">--</SelectItem>
                                {fieldExecutives.map((fe) => (
                                    <SelectItem key={fe.id} value={fe.id}>
                                        {fe.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Content */}
                    {showLoading ? (
                        <LoadingTable />
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-destructive">
                                Error loading doctors. Please try again.
                            </p>
                        </div>
                    ) : displayedDoctors.length > 0 ? (
                        <DoctorsTable doctors={displayedDoctors} />
                    ) : (
                        <EmptyState />
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDoctors;

/* ---------------- Sub-components ---------------- */

function DoctorsTable({ doctors }: { doctors: Doctor[] }) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Desktop / Tablet table */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead>Hospital / Clinic</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">
                                    {doctor.name}
                                </TableCell>
                                <TableCell>{doctor.designation ?? "—"}</TableCell>
                                <TableCell>{doctor.hospitalName ?? "—"}</TableCell>
                                <TableCell>{doctor.location ?? "—"}</TableCell>
                                <TableCell>{doctor.contactNumber ?? "—"}</TableCell>
                                <TableCell>
                                    <StatusBadge status={doctor.active ? "active" : "inactive"} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-border">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                    {doctor.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {doctor.designation ?? "—"}
                                </p>
                            </div>
                            <StatusBadge status={doctor.active ? "active" : "inactive"} />
                        </div>
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                            <Field label="Hospital" value={doctor.hospitalName} />
                            <Field label="City" value={doctor.location} />
                            <Field label="Contact" value={doctor.contactNumber} />
                        </dl>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Field({ label, value }: { label: string; value?: string }) {
    return (
        <div className="min-w-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-foreground truncate">{value ?? "—"}</dd>
        </div>
    );
}

function StatusBadge({ status }: { status?: string }) {
    const s = (status ?? "active").toLowerCase();
    const styles =
        s === "active"
            ? "bg-green-100 text-green-700"
            : s === "inactive"
                ? "bg-gray-100 text-gray-700"
                : "bg-amber-100 text-amber-700";
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles}`}
        >
            {status ?? "active"}
        </span>
    );
}

function LoadingTable() {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="hidden md:block">
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-border bg-muted/40">
                    {["Name", "Specialty", "Hospital", "City", "Contact", "Status"].map(
                        (h) => (
                            <Skeleton key={h} className="h-4 w-20" />
                        )
                    )}
                </div>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-6 gap-4 p-4 border-b border-border last:border-0"
                    >
                        {[...Array(6)].map((_, j) => (
                            <Skeleton key={j} className="h-4 w-full" />
                        ))}
                    </div>
                ))}
            </div>
            <div className="md:hidden p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
                No doctors found
            </h3>
            <p className="text-muted-foreground">
                No doctors available for the selected field executive
            </p>
        </div>
    );
}