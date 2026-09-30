import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StockTable, { StockEntry } from "@/components/manager-stock/StockTable";
import AddStockModal from "@/components/manager-stock/AddStockModal";
import UpdateStockModal from "@/components/manager-stock/UpdateStockModal";
import DeleteStockDialog from "@/components/manager-stock/DeleteStockDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/services/ProductService";
import {
  addStockByFe,
  deleteStockByFe,
  getAllStockists,
  getStockistStocksByFe,
  Stockist,
  updateStockByFe,
} from "@/services/StockistService";

interface ProductOption {
  id: number;
  name: string;
}

interface ExtendedStockEntry extends StockEntry {
  productId: number;
  stockistId: number;
}

const StockUpdate = () => {
  const { toast } = useToast();
  const feId = Number(sessionStorage.getItem("userID"));
  const [stockEntries, setStockEntries] = useState<ExtendedStockEntry[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ExtendedStockEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!feId) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const [productsRes, stockistsRes, stockRes] = await Promise.all([
        getProducts(),
        getAllStockists(),
        getStockistStocksByFe(feId),
      ]);

      setProducts(productsRes || []);
      setStockists(stockistsRes || []);

      const stockistsMap = new Map((stockistsRes || []).map((stockist) => [stockist.id, stockist]));
      const mappedEntries: ExtendedStockEntry[] = (stockRes || []).map((item) => ({
        id: item.id.toString(),
        productName: item.productName,
        marketName: stockistsMap.get(item.stockistId)?.location || stockistsMap.get(item.stockistId)?.marketName || "N/A",
        stockistName: item.stockistName,
        quantity: item.quantity,
        productId: item.productId,
        stockistId: item.stockistId,
      }));

      setStockEntries(mappedEntries);
    } catch (error) {
      console.error("Failed to load stock update data:", error);
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
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const handleAddStock = async (payload: { stockistId: number; productId: number; quantity: number }) => {
    if (!feId) return;

    const response = await addStockByFe(feId, payload);
    const stockist = stockists.find((item) => item.id === payload.stockistId);
    const product = products.find((item) => item.id === payload.productId);

    const nextEntry: ExtendedStockEntry = {
      id: response.id.toString(),
      productName: response.productName || product?.name || "",
      stockistName: response.stockistName || stockist?.name || "",
      marketName: stockist?.location || stockist?.marketName || "N/A",
      quantity: response.quantity ?? payload.quantity,
      productId: payload.productId,
      stockistId: payload.stockistId,
    };

    setStockEntries((prev) => [...prev, nextEntry]);
    setIsAddModalOpen(false);
    await refreshData();
  };

  const handleEdit = (entry: StockEntry) => {
    const extendedEntry = stockEntries.find((item) => item.id === entry.id) || null;
    setSelectedEntry(extendedEntry);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async (
    id: string,
    newQuantity: number,
    stockistId: number,
    productId: number,
    managerId: number
  ) => {
    try {
      const stockId = Number(id);
      const response = await updateStockByFe(managerId, stockId, {
        stockistId,
        productId,
        quantity: newQuantity,
      });

      setStockEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                quantity: response.quantity ?? newQuantity,
              }
            : entry
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
    const extendedEntry = stockEntries.find((item) => item.id === entry.id) || null;
    setSelectedEntry(extendedEntry);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEntry) return;

    try {
      await deleteStockByFe(feId, Number(selectedEntry.id));
      setStockEntries((prev) => prev.filter((entry) => entry.id !== selectedEntry.id));
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
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Stock Update</h1>
                <p className="text-muted-foreground mt-1">
                  Update product stocks under your stockists
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2" disabled={loading}>
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
            </div>

            {loading ? (
              <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
                Loading stock data...
              </div>
            ) : (
              <StockTable
                stockEntries={stockEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>

      <AddStockModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => {}}
        existingEntries={stockEntries}
        products={products}
        stockists={stockists}
        customSubmit={handleAddStock}
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
        managerId={feId}
      />

      <DeleteStockDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEntry(null);
        }}
        onConfirm={async () => {
          await handleConfirmDelete();
        }}
        entry={selectedEntry}
        stockistId={selectedEntry?.stockistId}
        productId={selectedEntry?.productId}
        managerId={feId}
      />
    </div>
  );
};

export default StockUpdate;
