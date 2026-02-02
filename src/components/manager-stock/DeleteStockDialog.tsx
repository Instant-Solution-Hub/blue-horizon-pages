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
  onConfirm: () => void;
  entry: StockEntry | null;
}

const DeleteStockDialog = ({
  open,
  onClose,
  onConfirm,
  entry,
}: DeleteStockDialogProps) => {
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStockDialog;
