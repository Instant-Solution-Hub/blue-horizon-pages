import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AddPromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (promotion: PromotionFormData) => void;
}

export interface PromotionFormData {
  name: string;
  description: string;
  type: "New Product" | "Offer" | "Campaign";
  startDate: Date;
  endDate: Date;
  product: string;
  benefits: string[];
  targetAudience: string[];
}

// Mock products - will be replaced with API data
const mockProducts = [
  "CardioMax 50mg",
  "ImmunoBoost Plus",
  "NeuroCalm 25mg",
  "GastroEase 100mg",
  "RespiClear Syrup",
  "DiabeCare 500mg",
];

const targetAudienceOptions = [
  "Cardiologists",
  "General Physicians",
  "Neurologists",
  "Psychiatrists",
  "Gastroenterologists",
  "Pulmonologists",
  "Endocrinologists",
  "Hospitals",
  "Pharmacies",
  "Stockists",
  "All Healthcare Providers",
];

const AddPromotionModal = ({ open, onOpenChange, onAdd }: AddPromotionModalProps) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    name: "",
    description: "",
    type: "New Product",
    startDate: new Date(),
    endDate: new Date(),
    product: "",
    benefits: [],
    targetAudience: [],
  });
  const [benefitInput, setBenefitInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.product && formData.targetAudience.length > 0) {
      onAdd(formData);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "New Product",
      startDate: new Date(),
      endDate: new Date(),
      product: "",
      benefits: [],
      targetAudience: [],
    });
    setBenefitInput("");
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefitInput.trim()],
      });
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((b) => b !== benefit),
    });
  };

  const toggleTargetAudience = (audience: string) => {
    if (formData.targetAudience.includes(audience)) {
      setFormData({
        ...formData,
        targetAudience: formData.targetAudience.filter((a) => a !== audience),
      });
    } else {
      setFormData({
        ...formData,
        targetAudience: [...formData.targetAudience, audience],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Promotion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Promotion Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter promotion name"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter promotion description"
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Type and Product */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "New Product" | "Offer" | "Campaign") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Product">New Product</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Campaign">Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={formData.product}
                onValueChange={(value) => setFormData({ ...formData, product: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label>Benefits & Offers</Label>
            <div className="flex gap-2">
              <Input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                placeholder="Add a benefit"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addBenefit}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="gap-1">
                    {benefit}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeBenefit(benefit)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label>Target Audience *</Label>
            <div className="flex flex-wrap gap-2">
              {targetAudienceOptions.map((audience) => (
                <Badge
                  key={audience}
                  variant={formData.targetAudience.includes(audience) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTargetAudience(audience)}
                >
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.product || formData.targetAudience.length === 0}
            >
              Add Promotion
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPromotionModal;
