import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { DoctorFilters as Filters } from "@/hooks/useDoctors";

const specializations = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Neurologist",
  "Oncologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Surgeon",
  "Urologist",
  "Other",
];

interface DoctorFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const DoctorFilters = ({ filters, onFiltersChange }: DoctorFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleSpecializationChange = (value: string) => {
    onFiltersChange({
      ...filters,
      specialization: value === "all" ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      is_active: value === "all" ? undefined : value === "active",
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters =
    filters.search || filters.specialization || filters.is_active !== undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search doctors..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.specialization || "all"}
        onValueChange={handleSpecializationChange}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {specializations.map((spec) => (
            <SelectItem key={spec} value={spec}>
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
            ? "active"
            : "inactive"
        }
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default DoctorFilters;
