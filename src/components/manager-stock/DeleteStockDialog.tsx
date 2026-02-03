import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StockEntry } from "./StockTable";

interface DeleteStockDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (stockistId: number, productId: number, managerId: number) => Promise<void>;
  entry: StockEntry | null;
  stockistId?: number;
  productId?: number;
  managerId?: number;
}

const DeleteStockDialog = ({
  open,
  onClose,
  onConfirm,
  entry,
  stockistId,
  productId,
  managerId,
}: DeleteStockDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!entry || stockistId === undefined || productId === undefined || managerId === undefined) return;

    try {
      setIsDeleting(true);
      await onConfirm(stockistId, productId, managerId);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!entry) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Stock Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the stock entry for{" "}
            <span className="font-semibold">{entry.productName}</span> under{" "}
            <span className="font-semibold">{entry.stockistName}</span> ({entry.marketName})?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStockDialog;
