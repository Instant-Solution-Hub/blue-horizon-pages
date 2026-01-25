import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Pencil, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ProductStock {
  id: number;
  name: string;
  totalQty: number;
  availableQty: number;
}


interface StockUpdateTabProps {
  products: ProductStock[];
  onUpdateStock: (id: number, newQty: number) => void;
}

const StockUpdateTab = ({ products, onUpdateStock }: StockUpdateTabProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  const handleEdit = (product: ProductStock) => {
    setEditingId(product.id);
    setEditQty(product.availableQty);
  };

  const handleSave = (product: ProductStock) => {
    if (editQty < 0) {
      toast({
        title: "Error",
        description: "Quantity cannot be negative",
        variant: "destructive",
      });
      return;
    }
    onUpdateStock(product.id, editQty);
    toast({
      title: "Success",
      description: `Stock for ${product.name} updated to ${editQty}`,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditQty(0);
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Stock Update
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update stocks of the products allocated
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 font-semibold text-primary">SL.NO</TableHead>
                <TableHead className="font-semibold text-primary">Product Name</TableHead>
                <TableHead className="font-semibold text-primary">Available Qty</TableHead>
                <TableHead className="w-24 text-center font-semibold text-primary">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Number(e.target.value))}
                        className="w-28 h-8 border-primary/30 focus:border-primary"
                        min={0}
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-primary">
                        {product.availableQty.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === product.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleSave(product)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockUpdateTab;
