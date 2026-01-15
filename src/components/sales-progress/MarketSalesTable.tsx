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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Market Wise Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 font-semibold">SL.NO</TableHead>
                <TableHead className="font-semibold">Market</TableHead>
                <TableHead className="font-semibold">Secondary Sales (₹)</TableHead>
                <TableHead className="w-24 text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((market, index) => (
                <TableRow key={market.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{market.marketName}</TableCell>
                  <TableCell>
                    {editingId === market.id ? (
                      <Input
                        type="number"
                        value={editForm?.secondarySales || 0}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="h-8 w-40"
                      />
                    ) : (
                      `₹${market.secondarySales.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === market.id ? (
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
