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
import { Pencil, Check, X, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketSale {
  id: number;
  marketName: string;
  secondarySales: number;
}

const initialMarkets: MarketSale[] = [
  { id: 1, marketName: "North Region", secondarySales: 125000 },
  { id: 2, marketName: "South Region", secondarySales: 180000 },
  { id: 3, marketName: "East Region", secondarySales: 95000 },
  { id: 4, marketName: "West Region", secondarySales: 145000 },
  { id: 5, marketName: "Central Region", secondarySales: 110000 },
];

const MarketSalesTable = () => {
  const [markets, setMarkets] = useState<MarketSale[]>(initialMarkets);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<MarketSale | null>(null);
  const { toast } = useToast();

  const handleEdit = (market: MarketSale) => {
    setEditingId(market.id);
    setEditForm({ ...market });
  };

  const handleSave = () => {
    if (editForm) {
      setMarkets(markets.map(m => m.id === editForm.id ? editForm : m));
      setEditingId(null);
      setEditForm(null);
      toast({
        title: "Updated Successfully",
        description: "Market sales data has been updated.",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (value: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        secondarySales: Number(value) || 0,
      });
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
                  key={market.id}
                  className="hover:bg-primary/5 transition-colors duration-200 border-b border-primary/10"
                >
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{market.marketName}</TableCell>
                  <TableCell>
                    {editingId === market.id ? (
                      <Input
                        type="number"
                        value={editForm?.secondarySales || 0}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="h-8 w-40 border-primary/30 focus:border-primary focus:ring-primary/20"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-green-600">
                        ₹{market.secondarySales.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === market.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 transition-colors"
                            onClick={handleSave}
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
                          onClick={() => handleEdit(market)}
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

export default MarketSalesTable;
