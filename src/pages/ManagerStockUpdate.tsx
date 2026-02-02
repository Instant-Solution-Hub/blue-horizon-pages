import { useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import StockTable, { StockEntry } from "@/components/manager-stock/StockTable";
import AddStockModal from "@/components/manager-stock/AddStockModal";
import UpdateStockModal from "@/components/manager-stock/UpdateStockModal";
import DeleteStockDialog from "@/components/manager-stock/DeleteStockDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for products
const mockProducts = [
  "Paracetamol 500mg",
  "Amoxicillin 250mg",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
  "Omeprazole 20mg",
  "Metformin 500mg",
];

// Mock data for stockists with their markets
const mockStockists = [
  { id: "1", name: "MedPlus Distributors", marketName: "North Zone" },
  { id: "2", name: "Apollo Pharmacy", marketName: "North Zone" },
  { id: "3", name: "HealthCare Supplies", marketName: "South Zone" },
  { id: "4", name: "PharmaCare Ltd", marketName: "South Zone" },
  { id: "5", name: "MediStock India", marketName: "East Zone" },
  { id: "6", name: "WellBeing Pharma", marketName: "East Zone" },
  { id: "7", name: "CureAll Distributors", marketName: "West Zone" },
  { id: "8", name: "LifeLine Pharma", marketName: "West Zone" },
];

// Mock initial stock entries
const initialStockEntries: StockEntry[] = [
  { id: "1", productName: "Paracetamol 500mg", marketName: "North Zone", stockistName: "MedPlus Distributors", quantity: 500 },
  { id: "2", productName: "Paracetamol 500mg", marketName: "North Zone", stockistName: "Apollo Pharmacy", quantity: 350 },
  { id: "3", productName: "Paracetamol 500mg", marketName: "South Zone", stockistName: "HealthCare Supplies", quantity: 420 },
  { id: "4", productName: "Amoxicillin 250mg", marketName: "North Zone", stockistName: "MedPlus Distributors", quantity: 200 },
  { id: "5", productName: "Amoxicillin 250mg", marketName: "East Zone", stockistName: "MediStock India", quantity: 180 },
  { id: "6", productName: "Ibuprofen 400mg", marketName: "West Zone", stockistName: "CureAll Distributors", quantity: 300 },
  { id: "7", productName: "Ibuprofen 400mg", marketName: "West Zone", stockistName: "LifeLine Pharma", quantity: 250 },
];

const ManagerStockUpdate = () => {
  const { toast } = useToast();
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(initialStockEntries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | null>(null);

  const handleAddStock = (newEntry: Omit<StockEntry, "id">) => {
    const id = Date.now().toString();
    setStockEntries(prev => [...prev, { ...newEntry, id }]);
    toast({
      title: "Stock Added",
      description: `Stock entry for ${newEntry.productName} added successfully`,
    });
  };

  const handleEdit = (entry: StockEntry) => {
    setSelectedEntry(entry);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    setStockEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, quantity: newQuantity } : entry
      )
    );
  };

  const handleDelete = (entry: StockEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEntry) {
      setStockEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));
      toast({
        title: "Stock Deleted",
        description: `Stock entry for ${selectedEntry.productName} deleted successfully`,
      });
      setSelectedEntry(null);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Stock Update</h1>
                <p className="text-muted-foreground mt-1">
                  Manage product stocks across markets and stockists
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
            </div>

            {/* Stock Table */}
            <StockTable
              stockEntries={stockEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddStockModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStock}
        existingEntries={stockEntries}
        products={mockProducts}
        stockists={mockStockists}
      />

      <UpdateStockModal
        open={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedEntry(null);
        }}
        onUpdate={handleUpdateStock}
        entry={selectedEntry}
      />

      <DeleteStockDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEntry(null);
        }}
        onConfirm={handleConfirmDelete}
        entry={selectedEntry}
      />
    </div>
  );
};

export default ManagerStockUpdate;
