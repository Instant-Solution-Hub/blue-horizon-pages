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
import { Pencil, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductSale {
  id: number;
  productName: string;
  newPTS: number;
  sales: number;
}

const initialProducts: ProductSale[] = [
  { id: 1, productName: "Larimar-500", newPTS: 150, sales: 12500 },
  { id: 2, productName: "Larimar-Plus", newPTS: 200, sales: 18000 },
  { id: 3, productName: "Larimar-D3", newPTS: 100, sales: 8500 },
  { id: 4, productName: "Larimar-Forte", newPTS: 175, sales: 15200 },
  { id: 5, productName: "Larimar-Gel", newPTS: 80, sales: 6800 },
];

const ProductSalesTable = () => {
  const [products, setProducts] = useState<ProductSale[]>(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProductSale | null>(null);
  const { toast } = useToast();

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  const handleEdit = (product: ProductSale) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    if (editForm) {
      setProducts(products.map(p => p.id === editForm.id ? editForm : p));
      setEditingId(null);
      setEditForm(null);
      toast({
        title: "Updated Successfully",
        description: "Product sales data has been updated.",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (field: keyof ProductSale, value: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: field === "productName" ? value : Number(value) || 0,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Individual Product Sales - {currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 font-semibold">SL.NO</TableHead>
                <TableHead className="font-semibold">Product Name</TableHead>
                <TableHead className="font-semibold">New PTS</TableHead>
                <TableHead className="font-semibold">Sales (₹)</TableHead>
                <TableHead className="w-24 text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editForm?.productName || ""}
                        onChange={(e) => handleInputChange("productName", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      product.productName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editForm?.newPTS || 0}
                        onChange={(e) => handleInputChange("newPTS", e.target.value)}
                        className="h-8 w-24"
                      />
                    ) : (
                      product.newPTS
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editForm?.sales || 0}
                        onChange={(e) => handleInputChange("sales", e.target.value)}
                        className="h-8 w-32"
                      />
                    ) : (
                      `₹${product.sales.toLocaleString()}`
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
                            onClick={handleSave}
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
                          className="h-8 w-8 text-primary hover:text-primary/80"
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

export default ProductSalesTable;
