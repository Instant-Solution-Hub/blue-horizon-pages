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

interface Stockist {
  id: string;
  name: string;
  marketName: string;
}

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<StockEntry, "id">) => void;
  existingEntries: StockEntry[];
  products: string[];
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
  const [stockistId, setStockistId] = useState("");
  const [marketName, setMarketName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Auto-fill market when stockist is selected
  useEffect(() => {
    if (stockistId) {
      const selectedStockist = stockists.find(s => s.id === stockistId);
      if (selectedStockist) {
        setMarketName(selectedStockist.marketName);
      }
    } else {
      setMarketName("");
    }
  }, [stockistId, stockists]);

  const handleSubmit = () => {
    if (!productName || !stockistId || !quantity) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedStockist = stockists.find(s => s.id === stockistId);
    if (!selectedStockist) return;

    // Check if entry already exists
    const exists = existingEntries.some(
      entry =>
        entry.productName === productName &&
        entry.stockistName === selectedStockist.name &&
        entry.marketName === selectedStockist.marketName
    );

    if (exists) {
      toast({
        title: "Entry Already Exists",
        description: "Stock entry for this product and stockist combination already exists. Please use update instead.",
        variant: "destructive",
      });
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      productName,
      marketName: selectedStockist.marketName,
      stockistName: selectedStockist.name,
      quantity: qty,
    });

    // Reset form
    setProductName("");
    setStockistId("");
    setMarketName("");
    setQuantity("");
    onClose();
  };

  const handleClose = () => {
    setProductName("");
    setStockistId("");
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
            <Select value={productName} onValueChange={setProductName}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product} value={product}>
                    {product}
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
                  <SelectItem key={stockist.id} value={stockist.id}>
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
