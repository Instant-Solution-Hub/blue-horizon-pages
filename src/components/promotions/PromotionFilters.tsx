import { Button } from "@/components/ui/button";

export type PromotionType = "all" | "new-product" | "offer" | "campaign";

interface PromotionFiltersProps {
  activeFilter: PromotionType;
  onFilterChange: (filter: PromotionType) => void;
}

const filters: { value: PromotionType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new-product", label: "New Product" },
  { value: "offer", label: "Offer" },
  { value: "campaign", label: "Campaign" },
];

const PromotionFilters = ({ activeFilter, onFilterChange }: PromotionFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="transition-all"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default PromotionFilters;
