import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Check, X, Store, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchMonthlyStockistSales,
  updateMonthlyStockistSales,
} from "@/services/SalesProgressService";

interface StockistSale {
  stockistId: number;
  stockistName: string;
  price: number;
}

const StockistSalesTable = () => {
  const { toast } = useToast();

  const [stockists, setStockists] = useState<StockistSale[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSales, setEditSales] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const feId = Number(sessionStorage.getItem("feID"));

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // ✅ LOAD DATA
  const loadStockists = async () => {
    try {
      setLoading(true);
      const data = await fetchMonthlyStockistSales(feId);
      setStockists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load stockist sales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (feId) loadStockists();
  }, [feId]);

  // ✅ EDIT
  const handleEdit = (stockist: StockistSale) => {
    setEditingId(stockist.stockistId);
    setEditSales(stockist.price || 0);
  };

  // ✅ SAVE
  const handleSave = async (stockistId: number) => {
    try {
      setLoading(true);

      await updateMonthlyStockistSales(feId, stockistId, editSales);

      // optimistic update
      setStockists((prev) =>
        prev.map((s) =>
          s.stockistId === stockistId
            ? { ...s, price: editSales }
            : s
        )
      );

      toast({
        title: "Updated Successfully",
        description: "Stockist primary sales updated.",
      });

      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update sales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditSales(0);
  };

  // ✅ LOADING STATE
  if (loading && stockists.length === 0) {
    return (
      <Card className="p-10 flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Stockist Wise Sales
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {currentMonth}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-16 font-semibold text-primary">
                  SL.NO
                </TableHead>
                <TableHead className="font-semibold text-primary">
                  Stockist Name
                </TableHead>
                <TableHead className="font-semibold text-primary">
                  Primary Sales (₹)
                </TableHead>
                <TableHead className="w-24 text-center font-semibold text-primary">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stockists.map((stockist, index) => (
                <TableRow
                  key={stockist.stockistId}
                  className="hover:bg-primary/5 transition-colors duration-200 border-b border-primary/10"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {stockist.stockistName}
                  </TableCell>

                  <TableCell>
                    {editingId === stockist.stockistId ? (
                      <Input
                        type="number"
                        value={editSales}
                        onChange={(e) =>
                          setEditSales(Number(e.target.value) || 0)
                        }
                        className="h-8 w-32 border-primary/30 focus:border-primary focus:ring-primary/20"
                        min={0}
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-green-600">
                        ₹{(stockist.price || 0).toLocaleString()}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === stockist.stockistId ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                            onClick={() => handleSave(stockist.stockistId)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => handleEdit(stockist)}
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

export default StockistSalesTable;