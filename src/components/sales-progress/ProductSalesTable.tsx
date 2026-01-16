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
import { Pencil, Check, X, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { fetchMonthlyProductSales , updateMonthlyProductSales } from "@/services/SalesProgressService";


interface ProductSale {
  productId: number;
  productName: string;
  pts: number;
  quantity: number;
  sales: number;
}


const ProductSalesTable = () => {
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const { toast } = useToast();

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

 const feId = Number(localStorage.getItem("feId")) || 2;

  useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchMonthlyProductSales(feId);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Failed to load sales data",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  loadData();
}, []);


  const handleEdit = (product: ProductSale) => {
    setEditingId(product.productId);
    setEditQty(product.quantity);
  };

const handleSave = async (product: ProductSale) => {
  try {
    await updateMonthlyProductSales(feId, product.productId, editQty);

    const updatedSales = editQty * product.pts;

    setProducts((prev) =>
      prev.map((p) =>
        p.productId === product.productId
          ? { ...p, quantity: editQty, sales: updatedSales }
          : p
      )
    );

    setEditingId(null);

    toast({
      title: "Updated Successfully",
      description: "Product sales updated for this month",
    });
  } catch (error) {
    toast({
      title: "Update Failed",
      description: "Could not save sales data. Try again.",
      variant: "destructive",
    });
  }
};


 const handleCancel = () => {
  setEditingId(null);
  setEditQty(0);
};


  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Individual Product Sales
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{currentMonth}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-16 font-semibold text-primary">SL.NO</TableHead>
                <TableHead className="font-semibold text-primary">Product Name</TableHead>
                <TableHead className="font-semibold text-primary">New PTS (₹)</TableHead>
                <TableHead className="font-semibold text-primary">Qty</TableHead>
                <TableHead className="font-semibold text-primary">Sales (₹)</TableHead>
                <TableHead className="w-24 text-center font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow 
                  key={product.productId} 
                  className="hover:bg-primary/5 transition-colors duration-200 border-b border-primary/10"
                >
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell className="text-muted-foreground">₹{product.pts.toLocaleString()}</TableCell>
                  <TableCell>
                    {editingId === product.productId ? (
                      <Input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Number(e.target.value) || 0)}
                        className="h-8 w-24 border-primary/30 focus:border-primary focus:ring-primary/20"
                        min={0}
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-primary">{product.quantity}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      {editingId === product.productId 
                        ? `₹${(editQty * product.pts).toLocaleString()}`
                        : `₹${product.sales.toLocaleString()}`
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === product.productId ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 transition-colors"
                            onClick={() => handleSave(product)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 transition-colors"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                          onClick={() => handleEdit(product)}
                          disabled={editingId !== null && editingId !== product.productId}
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

export default ProductSalesTable;
