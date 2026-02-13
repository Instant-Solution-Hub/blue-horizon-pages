import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  productName: string;
  category: string;
  description: string;
  pts: number;
  ptr: number;
  price: number;
  totalSales: number;
}

const ProductCard = ({
  productName,
  category,
  description,
  pts,
  ptr,
  price,
  totalSales,
}: ProductCardProps) => {
  return (
    <Card className="hover-lift card-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground leading-tight">
            {productName}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">PTS</p>
            <p className="text-sm font-semibold text-foreground">₹{pts.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">PTR</p>
            <p className="text-sm font-semibold text-foreground">₹{ptr.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-semibold text-foreground">₹{price.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Sales Amount</p>
            <p className="text-sm font-semibold text-primary">₹{totalSales.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
