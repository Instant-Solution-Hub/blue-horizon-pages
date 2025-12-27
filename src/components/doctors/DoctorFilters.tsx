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
import { DoctorFilters as Filters, Category, PracticeType } from "@/hooks/useDoctors";

const categories: { value: Category; label: string }[] = [
  { value: "A_PLUS", label: "A+" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

const practiceTypes: { value: PracticeType; label: string }[] = [
  { value: "RP", label: "RP" },
  { value: "OP", label: "OP" },
  { value: "NP", label: "NP" },
];

interface DoctorFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const DoctorFilters = ({ filters, onFiltersChange }: DoctorFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value === "all" ? undefined : (value as Category),
    });
  };

  const handlePracticeTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      practiceType: value === "all" ? undefined : (value as PracticeType),
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      active: value === "all" ? undefined : value === "active",
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters =
    filters.search || filters.category || filters.practiceType || filters.active !== undefined;

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
        value={filters.category || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.practiceType || "all"}
        onValueChange={handlePracticeTypeChange}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Practice Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {practiceTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          filters.active === undefined
            ? "all"
            : filters.active
            ? "active"
            : "inactive"
        }
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[130px]">
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
