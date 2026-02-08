import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Person {
  id: number;
  name: string;
  employeeCode: string;
  territory?: string;
  market?: string;
}

interface PersonSelectorProps {
  persons: Person[];
  selectedPersonId: number | null;
  onSelect: (id: number) => void;
  placeholder?: string;
}

export function PersonSelector({
  persons,
  selectedPersonId,
  onSelect,
  placeholder = "Search by name or employee ID...",
}: PersonSelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return persons;
    const q = query.toLowerCase();
    return persons.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.employeeCode.toLowerCase().includes(q)
    );
  }, [persons, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 bg-background"
        />
      </div>

      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No results found
          </p>
        ) : (
          filtered.map((person) => (
            <button
              key={person.id}
              onClick={() => onSelect(person.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                selectedPersonId === person.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30 hover:bg-accent"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{person.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs">
                    {person.employeeCode}
                  </Badge>
                  {person.territory && (
                    <span className="text-xs text-muted-foreground truncate">
                      {person.territory}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
