import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeamSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TeamSearchBar = ({ searchQuery, onSearchChange }: TeamSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search team members by name, market, or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-11 bg-background"
      />
    </div>
  );
};

export default TeamSearchBar;
