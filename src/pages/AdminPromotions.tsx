import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import StatsCards from "@/components/promotions/StatsCards";
import PromotionFilters, { PromotionType } from "@/components/promotions/PromotionFilters";
import AdminPromotionList from "@/components/admin-promotions/AdminPromotionList";
import AddPromotionModal, { PromotionFormData } from "@/components/admin-promotions/AddPromotionModal";
import UpdatePromotionModal, { UpdatePromotionFormData } from "@/components/admin-promotions/UpdatePromotionModal";
import { PromotionApi } from "@/components/promotions/PromotionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  mapPromotionApiToUi,
  PromotionRequestDto,
} from "@/services/PromotionService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState<PromotionApi[]>([]);
  const [activeFilter, setActiveFilter] = useState<PromotionType>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionApi | null>(null);
  const { toast } = useToast();

  // Fetch promotions on component mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getAllPromotions();
        const uiPromotions = data.map(mapPromotionApiToUi);
        setPromotions(uiPromotions);
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
        toast({
          title: "Error",
          description: "Failed to load promotions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

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

  const handleAddPromotion = async (formData: PromotionFormData) => {
    try {
      // Convert form data to API format
      const typeMap = {
        "New Product": "NEW_PRODUCT",
        "Offer": "OFFER",
        "Campaign": "CAMPAIGN",
      } as const;

      const payload: PromotionRequestDto = {
        name: formData.name,
        description: formData.description,
        type: typeMap[formData.type],
        product: formData.product,
        benefits: formData.benefits,
        targetAudience: formData.targetAudience,
        startDate: formData.startDate.toISOString().split("T")[0] + "T00:00:00",
        endDate: formData.endDate.toISOString().split("T")[0] + "T23:59:59",
        status: calculateStatus(formData.startDate, formData.endDate) === "Expired" ? "COMPLETED" : calculateStatus(formData.startDate, formData.endDate) === "Active" ? "ACTIVE" : "UPCOMING",
      };

      const response = await addPromotion(payload);
      const uiPromotion = mapPromotionApiToUi(response);
      setPromotions([uiPromotion, ...promotions]);
      setAddModalOpen(false);
      toast({
        title: "Success",
        description: `"${formData.name}" has been added successfully.`,
      });
    } catch (err) {
      console.error("Failed to add promotion:", err);
      toast({
        title: "Error",
         description: err.response?.data?.message || "Failed to add promotion",
        variant: "destructive",
      });
    }
  };

  const handleEditPromotion = (promotion: PromotionApi) => {
    setSelectedPromotion(promotion);
    setUpdateModalOpen(true);
  };

  const handleUpdatePromotion = async (id: string, formData: UpdatePromotionFormData) => {
    try {
      // Convert form data to API format
      const typeMap = {
        "New Product": "NEW_PRODUCT",
        "Offer": "OFFER",
        "Campaign": "CAMPAIGN",
      } as const;

      const payload: PromotionRequestDto = {
        name: formData.name,
        description: formData.description,
        type: typeMap[formData.type],
        product: formData.product,
        benefits: formData.benefits,
        targetAudience: formData.targetAudience,
        startDate: formData.startDate.toISOString().split("T")[0] + "T00:00:00",
        endDate: formData.endDate.toISOString().split("T")[0] + "T23:59:59",
        status: calculateStatus(formData.startDate, formData.endDate) === "Expired" ? "COMPLETED" : calculateStatus(formData.startDate, formData.endDate) === "Active" ? "ACTIVE" : "UPCOMING",
      };

      const response = await updatePromotion(parseInt(id), payload);
      const uiPromotion = mapPromotionApiToUi(response);
      
      setPromotions(
        promotions.map((p) => (p.id === id ? uiPromotion : p))
      );
      setUpdateModalOpen(false);
      setSelectedPromotion(null);
      toast({
        title: "Success",
        description: `"${formData.name}" has been updated successfully.`,
      });
    } catch (err) {
      console.error("Failed to update promotion:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update promotion",
        variant: "destructive",
      });
    }
  };

  const handleDeletePromotion = (promotion: PromotionApi) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!promotionToDelete) return;
    
    try {
      await deletePromotion(parseInt(promotionToDelete.id));
      setPromotions(promotions.filter((p) => p.id !== promotionToDelete.id));
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
      toast({
        title: "Success",
        description: `"${promotionToDelete.name}" has been deleted successfully.`,
      });
    } catch (err) {
      console.error("Failed to delete promotion:", err);
      toast({
        title: "Error",
        description: "Failed to delete promotion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
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
            onDeletePromotion={handleDeletePromotion}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{promotionToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPromotions;
