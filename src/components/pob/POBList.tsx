import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Building2, User, Calendar, Package, FileText, Pencil, Percent } from "lucide-react";

export interface POBOrder {
  id: string;
  doctorName: string;
  hospitalName: string;
  orderDate: Date;
  products: {
    id: string;
    productName: string;
    qty: number;
    price: number;
    total: number;
  }[];
  totalValue: number;
  discount?: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

interface POBListProps {
  orders: POBOrder[];
  searchQuery: string;
  onEdit?: (order: POBOrder) => void;
}

const POBList = ({ orders, searchQuery, onEdit }: POBListProps) => {
  const filteredOrders = orders.filter(order => 
    order.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (filteredOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          {searchQuery ? "No orders found matching your search." : "No orders recorded yet. Click 'Add New POB Order' to create one."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => {
        const subtotal = order.products.reduce((sum, p) => sum + p.total, 0);
        const discountAmount = order.discount || 0;
        
        return (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left Section - Order Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{order.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{order.hospitalName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(order.orderDate, "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{order.products.length} product(s)</span>
                    </div>
                  </div>

                  {/* Products Summary */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">Products:</p>
                    <div className="space-y-1">
                      {order.products.slice(0, 3).map((product, idx) => (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>{product.productName} x{product.qty}</span>
                          <span>₹{product.total}</span>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.products.length - 3} more items...
                        </p>
                      )}
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Percent className="w-4 h-4" />
                      <span>Discount Applied: ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {order.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{order.notes}</span>
                    </div>
                  )}
                </div>

                {/* Right Section - Total Value & Edit */}
                <div className="text-right space-y-3">
                  <div>
                    {discountAmount > 0 && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{subtotal.toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{order.totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(order.createdAt, "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(order)}
                      className="gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default POBList;