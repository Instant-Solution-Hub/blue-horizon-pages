import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import StockTable, { StockEntry } from "@/components/manager-stock/StockTable";
import AddStockModal from "@/components/manager-stock/AddStockModal";
import UpdateStockModal from "@/components/manager-stock/UpdateStockModal";
import DeleteStockDialog from "@/components/manager-stock/DeleteStockDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/services/ProductService";
import { getStockistsByManager, getStocksByManager, updateStock, deleteStock, Stockist } from "@/services/StockistService";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
}

interface ExtendedStockEntry extends StockEntry {
  stockistId: number;
  productId: number;
}

const ManagerStockUpdate = () => {
  const { toast } = useToast();
  const [stockEntries, setStockEntries] = useState<ExtendedStockEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ExtendedStockEntry | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const managerId = Number(localStorage.getItem("managerId")) || 1;

 useEffect(() => {
  setLoading(true);

  Promise.all([
    getProducts(),
    getStockistsByManager(managerId),
  ])
    .then(([productsRes, stockistsRes]) => {
      setProducts(productsRes);
      setStockists(stockistsRes);
    })
    .finally(() => setLoading(false));
}, []);

const fetchStocks = async () => {
  try {
    setLoading(true);

    const data = await getStocksByManager(managerId);

    const mapped: ExtendedStockEntry[] = data.map((item: any) => ({
      id: item.id.toString(),
      productName: item.productName,
      stockistName: item.stockistName,
      marketName: item.marketName,
      quantity: item.availableQuantity,
      stockistId: item.stockistId,
      productId: item.productId,
    }));

    setStockEntries(mapped);
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to load stock data",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const loadPage = async () => {
    await fetchStocks();
  };

  loadPage();
}, [stockists]);

  const handleEdit = (entry: StockEntry) => {
    const extendedEntry = stockEntries.find(e => e.id === entry.id) as ExtendedStockEntry;
    setSelectedEntry(extendedEntry);
    setIsUpdateModalOpen(true);
  };
  const handleAddStock = (newStock: StockEntry) => {
    // Add the new stock to existing entries with extended properties
    const extendedNewStock: ExtendedStockEntry = {
      ...newStock,
      stockistId: 0,
      productId: 0,
    };
    setStockEntries(prev => [...prev, extendedNewStock]);
  };

  const handleUpdateStock = async (
    id: string,
    newQuantity: number,
    stockistId: number,
    productId: number,
    managerId: number
  ) => {
    try {
      const payload = {
        managerId,
        stockistId,
        productId,
        quantity: newQuantity,
      };

      await updateStock(payload);

      setStockEntries(prev =>
        prev.map(entry =>
          entry.id === id ? { ...entry, quantity: newQuantity } : entry
        )
      );

      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  };

  const handleDelete = (entry: StockEntry) => {
    const extendedEntry = stockEntries.find(e => e.id === entry.id) as ExtendedStockEntry;
    setSelectedEntry(extendedEntry);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (
    stockistId: number,
    productId: number,
    managerId: number
  ) => {
    if (!selectedEntry) return;

    try {
      await deleteStock(managerId, stockistId, productId);

      setStockEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));
      toast({
        title: "Stock Deleted",
        description: `Stock entry for ${selectedEntry.productName} deleted successfully`,
      });
      setSelectedEntry(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast({
        title: "Error",
        description: "Failed to delete stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
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
        existingEntries={stockEntries}
        products={products}
        stockists={stockists}
        onAdd={handleAddStock}
      />

      <UpdateStockModal
        open={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedEntry(null);
        }}
        onUpdate={handleUpdateStock}
        entry={selectedEntry}
        stockistId={selectedEntry?.stockistId}
        productId={selectedEntry?.productId}
        managerId={managerId}
      />

      <DeleteStockDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEntry(null);
        }}
        onConfirm={handleConfirmDelete}
        entry={selectedEntry}
        stockistId={selectedEntry?.stockistId}
        productId={selectedEntry?.productId}
        managerId={managerId}
      />
    </div>
  );
};

export default ManagerStockUpdate;
