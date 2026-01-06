import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCards from "@/components/promotions/StatsCards";
import PromotionFilters, { PromotionType } from "@/components/promotions/PromotionFilters";
import PromotionList, { Promotion } from "@/components/promotions/PromotionList";
import { useToast } from "@/hooks/use-toast";

// Mock data - will be replaced with backend data
const mockPromotions: Promotion[] = [
  {
    id: "1",
    type: "New Product",
    status: "Active",
    name: "CardioMax 50mg Launch",
    description: "Introducing our latest cardiovascular medication with enhanced bioavailability",
    productName: "CardioMax 50mg",
    targetAudience: "Cardiologists, General Physicians",
    benefitsAndOffers: "Free samples pack, 10% introductory discount",
    validFrom: new Date("2026-01-01"),
    validTo: new Date("2026-02-28"),
  },
  {
    id: "2",
    type: "Offer",
    status: "Active",
    name: "Winter Health Scheme",
    description: "Special discounts on immunity boosters and cold medications",
    productName: "ImmunoBoost Plus",
    targetAudience: "All Healthcare Providers",
    benefitsAndOffers: "Buy 10 Get 2 Free, Extended credit period",
    validFrom: new Date("2025-12-15"),
    validTo: new Date("2026-01-31"),
  },
  {
    id: "3",
    type: "Campaign",
    status: "Upcoming",
    name: "Heart Health Awareness Month",
    description: "Join our nationwide campaign to promote heart health awareness",
    productName: "CardioMax Range",
    targetAudience: "Cardiologists, Hospitals",
    benefitsAndOffers: "CME credits, Patient education materials, Camp support",
    validFrom: new Date("2026-02-01"),
    validTo: new Date("2026-02-28"),
  },
  {
    id: "4",
    type: "Offer",
    status: "Expired",
    name: "Year End Clearance",
    description: "Special clearance prices on select products",
    productName: "Multiple Products",
    targetAudience: "Stockists, Pharmacies",
    benefitsAndOffers: "Up to 25% off on bulk orders",
    validFrom: new Date("2025-11-01"),
    validTo: new Date("2025-12-31"),
  },
  {
    id: "5",
    type: "New Product",
    status: "Upcoming",
    name: "NeuroCalm 25mg Introduction",
    description: "New anti-anxiety medication with minimal side effects",
    productName: "NeuroCalm 25mg",
    targetAudience: "Psychiatrists, Neurologists",
    benefitsAndOffers: "Exclusive launch event, Research papers included",
    validFrom: new Date("2026-02-15"),
    validTo: new Date("2026-04-15"),
  },
];

const Promotions = () => {
  const [activeFilter, setActiveFilter] = useState<PromotionType>("all");
  const { toast } = useToast();

  const filteredPromotions = mockPromotions.filter((promotion) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "new-product") return promotion.type === "New Product";
    if (activeFilter === "offer") return promotion.type === "Offer";
    if (activeFilter === "campaign") return promotion.type === "Campaign";
    return true;
  });

  const activeCount = mockPromotions.filter((p) => p.status === "Active").length;
  const upcomingCount = mockPromotions.filter((p) => p.status === "Upcoming").length;

  const handleUsePromotion = (promotion: Promotion) => {
    toast({
      title: "Promotion Selected",
      description: `You selected "${promotion.name}". This will be applied to your next visit.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Heading */}
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">Promotions</h1>
          {/* Subheading */}
          <p className="text-sm text-muted-foreground mb-6">
            Stay updated with company promotions, new product launches, and special offers to maximize your sales opportunities.
          </p>

          {/* Stats Cards */}
          <StatsCards
            totalPromotions={mockPromotions.length}
            activeCount={activeCount}
            upcomingCount={upcomingCount}
          />

          {/* Filter Tabs */}
          <PromotionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

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
