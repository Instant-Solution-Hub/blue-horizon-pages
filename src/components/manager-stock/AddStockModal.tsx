import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StockEntry } from "./StockTable";
import { Product } from "@/pages/ManagerStockUpdate";
import { addStock } from "@/services/StockistService";

interface Stockist {
  id: number;
  name: string;
  marketName: string;
}

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newStock: StockEntry) => void;
  existingEntries: StockEntry[];
  products: Product[];
  stockists: Stockist[];
}

const AddStockModal = ({
  open,
  onClose,
  onAdd,
  existingEntries,
  products,
  stockists,
}: AddStockModalProps) => {
  const { toast } = useToast();
  const [productName, setProductName] = useState("");
  const[productId,setProductId] = useState<string>("");
  const [stockistId, setStockistId] = useState<string>("");
  const [marketName, setMarketName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Auto-fill market when stockist is selected
  useEffect(() => {
    if (stockistId) {
      const selectedStockist = stockists.find(s => s.id === Number(stockistId));
      if (selectedStockist) {
        setMarketName(selectedStockist.marketName);
      }
    } else {
      setMarketName("");
    }
  }, [stockistId, stockists]);

  // Keep productName in sync with selected productId
  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find(p => p.id === Number(productId));
      setProductName(selectedProduct?.name || "");
    } else {
      setProductName("");
    }
  }, [productId, products]);


   const handleSubmit = async () => {
    if (!productId || !stockistId || !quantity) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
      const selectedStockist = stockists.find(s => s.id === Number(stockistId));
      if (!selectedStockist) return;

      const selectedProduct = products.find(p => p.id === Number(productId));

      // Check if entry already exists. Prefer ID comparison if backend provided IDs
      const exists = existingEntries.some(entry => {
        const entryProductId = (entry as any).productId ?? null;
        const entryStockistId = (entry as any).stockistId ?? null;

        if (entryProductId !== null && entryStockistId !== null) {
          return entryProductId === Number(productId) && entryStockistId === Number(stockistId);
        }

        // fallback to name-based comparison
        return (
          entry.productName === (selectedProduct?.name || productName) &&
          entry.stockistName === selectedStockist.name &&
          entry.marketName === selectedStockist.marketName
        );
      });

    if (exists) {
      toast({
        title: "Entry Already Exists",
        description: "Stock entry for this product and stockist combination already exists. Please use update instead.",
        variant: "destructive",
      });
      return;
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
     const responseData =  await addStock({
        managerId: Number(sessionStorage.getItem("userID")),
        productId: Number(productId),
        stockistId: Number(stockistId),
        quantity: qty,
      });

      // Get the product name from the products array
      const selectedProduct = products.find(p => p.id === Number(productId));
      const productName = selectedProduct?.name || "";

      // Create a new StockEntry from the response data
      const newStock: StockEntry = {
        id: responseData.id.toString(),
        productName: responseData.productName || productName,
        stockistName: responseData.stockistName || selectedStockist.name,
        marketName: responseData.marketName || selectedStockist.marketName,
        quantity: responseData.availableQuantity || qty,
      };

      // Pass the new stock to the parent instead of refetching
      onAdd(newStock);

      toast({
        title: "Success",
        description: "Stock added successfully",
      });

      setProductName("");
    setStockistId("");
    setMarketName("");
    setQuantity("");
    onClose();
      onClose();
    } catch (err) {
        console.log(err);
      toast({
        title: "Error",
        description: "Failed to add stock",
        variant: "destructive",
      });
    }
  };


  const handleClose = () => {
    setProductName("");
    setStockistId(null);
    setMarketName("");
    setQuantity("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Stock Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product Name *</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockist">Stockist *</Label>
            <Select value={stockistId} onValueChange={setStockistId}>
              <SelectTrigger>
                <SelectValue placeholder="Select stockist" />
              </SelectTrigger>
              <SelectContent>
                {stockists.map(stockist => (
                  <SelectItem key={stockist.id} value={stockist.id.toString()}>
                    {stockist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market">Market Name</Label>
            <Input
              id="market"
              value={marketName}
              disabled
              className="bg-muted"
              placeholder="Auto-filled based on stockist"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter stock quantity"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockModal;
