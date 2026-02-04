import { useState , useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCards from "@/components/promotions/StatsCards";
import PromotionFilters, { PromotionType } from "@/components/promotions/PromotionFilters";
import PromotionList, { PromotionApi } from "@/components/promotions/PromotionList";
import { useToast } from "@/hooks/use-toast";
import { getAllPromotions , mapPromotionApiToUi } from "@/services/PromotionService";



const Promotions = () => {
  const [activeFilter, setActiveFilter] = useState<PromotionType>("all");
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<PromotionApi[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getAllPromotions()
    .then(data => setPromotions(data.map(mapPromotionApiToUi)))
    .catch(() =>
      toast({
        title: "Error",
        description: "Failed to load promotions",
        variant: "destructive",
      })
    )
    .finally(() => setLoading(false));
}, []);



 const filteredPromotions = promotions.filter((promotion) => {
  if (activeFilter === "all") return true;
  if (activeFilter === "new-product") return promotion.type === "New Product";
  if (activeFilter === "offer") return promotion.type === "Offer";
  if (activeFilter === "campaign") return promotion.type === "Campaign";
  return true;
});

const activeCount = promotions.filter(p => p.status === "Active").length;
const upcomingCount = promotions.filter(p => p.status === "Upcoming").length;


  const handleUsePromotion = (promotion: PromotionApi) => {
    toast({
      title: "Promotion Selected",
      description: `You selected "${promotion.name}". This will be applied to your next visit.`,
    });
  };

  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Heading */}
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">Promotions</h1>
          {/* Subheading */}
          <p className="text-sm text-muted-foreground mb-6">
            Stay updated with company promotions, new product launches, and special offers to maximize your sales opportunities.
          </p>

          {/* Stats Cards */}
          <StatsCards
            totalPromotions={promotions.length}
            activeCount={activeCount}
            upcomingCount={upcomingCount}
          />

          {/* Filter Tabs */}
          <PromotionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
             {loading && (
  <p className="text-sm text-muted-foreground">Loading promotions...</p>
)}

          {/* Promotion List */}
          <PromotionList
            promotions={filteredPromotions}
            onUsePromotion={handleUsePromotion}
          />
        </main>
      </div>
    </div>
  );
};

export default Promotions;
