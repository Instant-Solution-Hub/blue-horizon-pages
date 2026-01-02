import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VisitSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  onAddVisit: () => void;
}

export function VisitSearchBar({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onAddVisit,
}: VisitSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search visits..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visits</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="pharmacist">Pharmacist</SelectItem>
            <SelectItem value="stockist">Stockist</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddVisit} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Visit
        </Button>
      </div>
    </div>
  );
}
