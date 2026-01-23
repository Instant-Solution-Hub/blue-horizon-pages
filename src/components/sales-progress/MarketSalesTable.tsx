import { useState , useEffect } from "react";
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
import { Pencil, Check, X, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMonthlyMarketSales, updateMarketSales } from "@/services/SalesProgressService";


interface MarketSale {
  market: string;
  salesAmount: number;
  month: number;
  year: number;
}


const MarketSalesTable = () => {
  const [markets, setMarkets] = useState<MarketSale[]>([]);
  const [editingMarket, setEditingMarket] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const { toast } = useToast();
  const feId =  Number(localStorage.getItem("feId")) || 7;// later from auth context
const now = new Date();


useEffect(() => {
  getMonthlyMarketSales(feId)
    .then(setMarkets)
    .catch(() =>
      toast({
        title: "Error",
        description: "Failed to load market sales",
        variant: "destructive",
      })
    );
}, []);


 const handleEdit = (market: MarketSale) => {
    setEditingMarket(market.market);
    setEditValue(market.salesAmount);
  };

  const handleCancel = () => {
    setEditingMarket(null);
    setEditValue(0);
  };

  const handleSave = async (market: MarketSale) => {
    try {
      const updated = await updateMarketSales(feId, {
        market: market.market,
        salesAmount: editValue,
       
      });
      console.log("Data");
      console.log(updated);

      setMarkets(prev =>
        prev.map(m =>
          m.market === updated.market ? updated : m
        )
      );

      toast({
        title: "Updated",
        description: "Market sales updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update market sales",
        variant: "destructive",
      });
    } finally {
      setEditingMarket(null);
      setEditValue(0);
    }
  };



  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Market Wise Sales
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Regional performance overview</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-16 font-semibold text-primary">SL.NO</TableHead>
                <TableHead className="font-semibold text-primary">Market</TableHead>
                <TableHead className="font-semibold text-primary">Secondary Sales (₹)</TableHead>
                <TableHead className="w-24 text-center font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((market, index) => (
                <TableRow 
                  key={market.market}
                  className="hover:bg-primary/5 transition-colors duration-200 border-b border-primary/10"
                >
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{market.market}</TableCell>
                  <TableCell>
                  {editingMarket === market.market ? (
                    <Input
                      type="number"
                      min={0}
                      value={editValue}
                      onChange={e =>
                        setEditValue(Number(e.target.value) || 0)
                      }
                      className="h-8 w-40"
                      autoFocus
                    />
                  ) : (
                    <span className="font-semibold text-green-600">
                      ₹{market.salesAmount.toLocaleString()}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-1">
                    {editingMarket === market.market ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSave(market)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(market)}
                        disabled={editingMarket !== null && editingMarket !== market.market}

                        
                      >
                        <Pencil className="h-4 w-4 text-primary" />
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

export default MarketSalesTable;
