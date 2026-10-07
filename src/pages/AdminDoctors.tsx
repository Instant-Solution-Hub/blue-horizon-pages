import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import Header from "@/components/dashboard/Header";
import DoctorCard from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDoctors } from "@/hooks/useDoctors";
import { FileSpreadsheet, Stethoscope, Users } from "lucide-react";
import { toast } from "sonner";

const FIELD_EXECUTIVES = [
  { id: "all", name: "All Field Executives" },
  { id: "fe1", name: "Rahul Sharma" },
  { id: "fe2", name: "Priya Patel" },
  { id: "fe3", name: "Amit Kumar" },
  { id: "fe4", name: "Sneha Reddy" },
];

const AdminDoctors = () => {
  const [selectedFE, setSelectedFE] = useState("all");
  const { data: doctors, isLoading, error } = useDoctors();

  const filteredDoctors = useMemo(() => doctors ?? [], [doctors]);

  const handleExport = () => {
    const feName =
      FIELD_EXECUTIVES.find((f) => f.id === selectedFE)?.name ??
      "All Field Executives";
    toast.success(`Export requested for ${feName}'s doctor list`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Doctors
                </h1>
                <p className="text-sm text-muted-foreground">
                  View doctor lists of all field executives
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <FileSpreadsheet className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Field Executive Selector */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="font-medium">Field Executive:</span>
            </div>
            <Select value={selectedFE} onValueChange={setSelectedFE}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Field Executive" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_EXECUTIVES.map((fe) => (
                  <SelectItem key={fe.id} value={fe.id}>
                    {fe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">
                Error loading doctors. Please try again.
              </p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} readOnly />
              ))}
            </div>
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDoctors;
