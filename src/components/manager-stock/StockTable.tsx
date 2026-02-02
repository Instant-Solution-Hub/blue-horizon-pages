import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Pencil, Trash2 } from "lucide-react";

export interface StockEntry {
  id: string;
  productName: string;
  marketName: string;
  stockistName: string;
  quantity: number;
}

interface StockTableProps {
  stockEntries: StockEntry[];
  onEdit: (entry: StockEntry) => void;
  onDelete: (entry: StockEntry) => void;
}

interface GroupedStock {
  productName: string;
  markets: {
    marketName: string;
    stockists: {
      stockistName: string;
      quantity: number;
      entry: StockEntry;
    }[];
    totalStock: number;
  }[];
  totalStock: number;
}

const StockTable = ({ stockEntries, onEdit, onDelete }: StockTableProps) => {
  // Group stock entries by product and market
  const groupedData: GroupedStock[] = stockEntries.reduce((acc, entry) => {
    let product = acc.find(p => p.productName === entry.productName);
    
    if (!product) {
      product = {
        productName: entry.productName,
        markets: [],
        totalStock: 0
      };
      acc.push(product);
    }
    
    let market = product.markets.find(m => m.marketName === entry.marketName);
    
    if (!market) {
      market = {
        marketName: entry.marketName,
        stockists: [],
        totalStock: 0
      };
      product.markets.push(market);
    }
    
    market.stockists.push({
      stockistName: entry.stockistName,
      quantity: entry.quantity,
      entry
    });
    
    market.totalStock += entry.quantity;
    product.totalStock += entry.quantity;
    
    return acc;
  }, [] as GroupedStock[]);

  let serialNo = 0;

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Stock Inventory
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage product stocks by market and stockist
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
                <TableHead className="font-semibold text-primary">Market / Stockist</TableHead>
                <TableHead className="font-semibold text-primary text-right">Stock Qty</TableHead>
                <TableHead className="w-24 text-center font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No stock entries found. Add stock to get started.
                  </TableCell>
                </TableRow>
              ) : (
                groupedData.map((product) => (
                  product.markets.map((market, marketIdx) => (
                    market.stockists.map((stockist, stockistIdx) => {
                      serialNo++;
                      const isFirstStockistInMarket = stockistIdx === 0;
                      const isFirstMarketInProduct = marketIdx === 0 && stockistIdx === 0;
                      
                      return (
                        <TableRow 
                          key={stockist.entry.id} 
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-medium">{serialNo}</TableCell>
                          <TableCell>
                            {isFirstMarketInProduct ? (
                              <div>
                                <span className="font-semibold text-foreground">{product.productName}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Total: {product.totalStock.toLocaleString()}
                                </Badge>
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {isFirstStockistInMarket && (
                                <div className="font-medium text-primary">{market.marketName}</div>
                              )}
                              <div className="text-sm text-muted-foreground pl-4 flex items-center gap-2">
                                <span>↳</span>
                                <span>{stockist.stockistName}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold text-primary">
                              {stockist.quantity.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                                onClick={() => onEdit(stockist.entry)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                onClick={() => onDelete(stockist.entry)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ))
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTable;
