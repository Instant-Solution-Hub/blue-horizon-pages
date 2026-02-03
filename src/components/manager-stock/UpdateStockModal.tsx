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
import { useToast } from "@/hooks/use-toast";
import { StockEntry } from "./StockTable";

interface UpdateStockModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, newQuantity: number, stockistId: number, productId: number, managerId: number) => Promise<void>;
  entry: StockEntry | null;
  stockistId?: number;
  productId?: number;
  managerId?: number;
}

const UpdateStockModal = ({
  open,
  onClose,
  onUpdate,
  entry,
  stockistId,
  productId,
  managerId,
}: UpdateStockModalProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setQuantity(entry.quantity.toString());
    }
  }, [entry]);

  const handleSubmit = async () => {
    if (!entry || stockistId === undefined || productId === undefined || managerId === undefined) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(entry.id, qty, stockistId, productId, managerId);
      toast({
        title: "Stock Updated",
        description: `Stock for ${entry.productName} updated to ${qty}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input value={entry.productName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Market Name</Label>
            <Input value={entry.marketName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Stockist Name</Label>
            <Input value={entry.stockistName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter new quantity"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockModal;
