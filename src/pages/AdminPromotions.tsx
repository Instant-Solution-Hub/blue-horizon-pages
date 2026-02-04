import { useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import StatsCards from "@/components/promotions/StatsCards";
import PromotionFilters, { PromotionType } from "@/components/promotions/PromotionFilters";
import AdminPromotionList from "@/components/admin-promotions/AdminPromotionList";
import AddPromotionModal, { PromotionFormData } from "@/components/admin-promotions/AddPromotionModal";
import UpdatePromotionModal, { UpdatePromotionFormData } from "@/components/admin-promotions/UpdatePromotionModal";
import { Promotion } from "@/components/promotions/PromotionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - will be replaced with backend data
const initialPromotions: Promotion[] = [
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

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [activeFilter, setActiveFilter] = useState<PromotionType>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const filteredPromotions = promotions.filter((promotion) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "new-product") return promotion.type === "New Product";
    if (activeFilter === "offer") return promotion.type === "Offer";
    if (activeFilter === "campaign") return promotion.type === "Campaign";
    return true;
  });

  const activeCount = promotions.filter((p) => p.status === "Active").length;
  const upcomingCount = promotions.filter((p) => p.status === "Upcoming").length;

  const calculateStatus = (startDate: Date, endDate: Date): "Active" | "Upcoming" | "Expired" => {
    const now = new Date();
    if (endDate < now) return "Expired";
    if (startDate > now) return "Upcoming";
    return "Active";
  };

  const handleAddPromotion = (formData: PromotionFormData) => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      type: formData.type,
      status: calculateStatus(formData.startDate, formData.endDate),
      name: formData.name,
      description: formData.description,
      productName: formData.product,
      targetAudience: formData.targetAudience.join(", "),
      benefitsAndOffers: formData.benefits.join(", "),
      validFrom: formData.startDate,
      validTo: formData.endDate,
    };
    setPromotions([newPromotion, ...promotions]);
    toast({
      title: "Promotion Added",
      description: `"${formData.name}" has been added successfully.`,
    });
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setUpdateModalOpen(true);
  };

  const handleUpdatePromotion = (id: string, formData: UpdatePromotionFormData) => {
    setPromotions(
      promotions.map((p) =>
        p.id === id
          ? {
              ...p,
              type: formData.type,
              status: calculateStatus(formData.startDate, formData.endDate),
              name: formData.name,
              description: formData.description,
              productName: formData.product,
              targetAudience: formData.targetAudience.join(", "),
              benefitsAndOffers: formData.benefits.join(", "),
              validFrom: formData.startDate,
              validTo: formData.endDate,
            }
          : p
      )
    );
    toast({
      title: "Promotion Updated",
      description: `"${formData.name}" has been updated successfully.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Heading */}
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">Promotions</h1>
          {/* Subheading */}
          <p className="text-sm text-muted-foreground mb-6">
            Manage company promotions, new product launches, and special offers for field executives.
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

          {/* Add Button */}
          <div className="flex justify-end mb-4">
            <Button onClick={() => setAddModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Promotion
            </Button>
          </div>

          {/* Promotion List */}
          <AdminPromotionList
            promotions={filteredPromotions}
            onEditPromotion={handleEditPromotion}
          />
        </main>
      </div>

      {/* Add Modal */}
      <AddPromotionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={handleAddPromotion}
      />

      {/* Update Modal */}
      <UpdatePromotionModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        promotion={selectedPromotion}
        onUpdate={handleUpdatePromotion}
      />
    </div>
  );
};

export default AdminPromotions;
