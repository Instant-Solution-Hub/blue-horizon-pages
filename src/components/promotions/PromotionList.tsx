import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Tag, Megaphone, Calendar, Users, Gift } from "lucide-react";
import { format } from "date-fns";

export interface Promotion {
  id: string;
  type: "New Product" | "Offer" | "Campaign";
  status: "Active" | "Upcoming" | "Expired";
  name: string;
  description: string;
  productName: string;
  targetAudience: string;
  benefitsAndOffers: string;
  validFrom: Date;
  validTo: Date;
}

interface PromotionListProps {
  promotions: Promotion[];
  onUsePromotion: (promotion: Promotion) => void;
}

const PromotionList = ({ promotions, onUsePromotion }: PromotionListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "New Product":
        return <Package className="h-4 w-4" />;
      case "Offer":
        return <Tag className="h-4 w-4" />;
      case "Campaign":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "New Product":
        return "bg-primary/10 text-primary border-primary/20";
      case "Offer":
        return "bg-success/10 text-success border-success/20";
      case "Campaign":
        return "bg-stockist/10 text-stockist border-stockist/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Upcoming":
        return "bg-stockist/10 text-stockist border-stockist/20";
      case "Expired":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No promotions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promotions.map((promotion) => (
        <Card key={promotion.id} className="border-border card-shadow hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1 space-y-3">
                {/* Header with Type and Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`${getTypeBadgeColor(promotion.type)} flex items-center gap-1`}>
                    {getTypeIcon(promotion.type)}
                    {promotion.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusBadgeColor(promotion.status)}>
                    {promotion.status}
                  </Badge>
                </div>

                {/* Name and Description */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{promotion.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Product: <span className="text-foreground">{promotion.productName}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Target: <span className="text-foreground">{promotion.targetAudience}</span></span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Gift className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs">Benefits:</span>
                      <ul className="mt-1 space-y-1">
                        {promotion.benefitsAndOffers.split(",").map((benefit, idx) => (
                          <li key={idx} className="text-foreground text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                            {benefit.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Valid: <span className="text-foreground">{format(promotion.validFrom, "dd MMM")} - {format(promotion.validTo, "dd MMM yyyy")}</span></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex lg:flex-col items-center gap-2">
                <Button
                  onClick={() => onUsePromotion(promotion)}
                  disabled={promotion.status === "Expired"}
                  className="w-full lg:w-auto"
                >
                  Use This Promotion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PromotionList;
