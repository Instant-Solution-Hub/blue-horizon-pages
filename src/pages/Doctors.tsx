import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorDialog from "@/components/doctors/DoctorDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
  Doctor,
  DoctorFormData,
  DoctorFilters as Filters,
} from "@/hooks/useDoctors";
import { Plus, Stethoscope } from "lucide-react";

const Doctors = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { data: doctors, isLoading, error } = useDoctors(filters);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const handleCreate = () => {
    setSelectedDoctor(null);
    setDialogOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteDoctor.mutate(id);
  };

  const handleSubmit = (data: DoctorFormData) => {
    if (selectedDoctor) {
      updateDoctor.mutate(
        { id: selectedDoctor.id, data },
        {
          onSuccess: () => setDialogOpen(false),
        }
      );
    } else {
      createDoctor.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

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
                  Manage your doctor database
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Doctor
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <DoctorFilters filters={filters} onFiltersChange={setFilters} />
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
          ) : doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.specialization
                  ? "Try adjusting your filters"
                  : "Get started by adding your first doctor"}
              </p>
              {!filters.search && !filters.specialization && (
                <Button onClick={handleCreate} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Doctor
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create/Edit Dialog */}
      <DoctorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={selectedDoctor}
        onSubmit={handleSubmit}
        isLoading={createDoctor.isPending || updateDoctor.isPending}
      />
    </div>
  );
};

export default Doctors;
