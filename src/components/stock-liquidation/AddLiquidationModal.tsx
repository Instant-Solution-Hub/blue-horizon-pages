import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface LiquidationPlan {
  id: string;
  product: string;
  quantity: number;
  doctor: string;
  targetLiquidation: number;
  achievedUnits: number;
  marketName: string;
  medicalShopName?: string;
  status: "PENDING" | "APPROVED";
  createdAt: Date;
}

interface AddLiquidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<LiquidationPlan, "id" | "createdAt">) => void;
  editData?: LiquidationPlan | null;
}

// Mock data - replace with actual API calls
const mockProducts = [
  { name: "Paracetamol 500mg", stock: 1500 },
  { name: "Amoxicillin 250mg", stock: 800 },
  { name: "Omeprazole 20mg", stock: 1200 },
  { name: "Metformin 500mg", stock: 2000 },
  { name: "Atorvastatin 10mg", stock: 950 },
  { name: "Ciprofloxacin 500mg", stock: 600 },
];

const mockDoctors = [
  "Dr. Rajesh Kumar",
  "Dr. Priya Sharma",
  "Dr. Amit Patel",
  "Dr. Sunita Reddy",
  "Dr. Vikram Singh",
  "Dr. Anita Desai",
];

const AddLiquidationModal = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
}: AddLiquidationModalProps) => {
  const { toast } = useToast();
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [doctor, setDoctor] = useState("");
  const [targetLiquidation, setTargetLiquidation] = useState("");
  const [marketName, setMarketName] = useState("");
  const [medicalShopName, setMedicalShopName] = useState("");
  const [doctorOpen, setDoctorOpen] = useState(false);

  useEffect(() => {
    if (editData) {
      setProduct(editData.product);
      setQuantity(editData.quantity);
      setDoctor(editData.doctor);
      setTargetLiquidation(editData.targetLiquidation.toString());
      setMarketName(editData.marketName);
      setMedicalShopName(editData.medicalShopName || "");
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  useEffect(() => {
    // Auto-fill quantity when product is selected
    const selectedProduct = mockProducts.find((p) => p.name === product);
    if (selectedProduct) {
      setQuantity(selectedProduct.stock);
    }
  }, [product]);

  const resetForm = () => {
    setProduct("");
    setQuantity(0);
    setDoctor("");
    setTargetLiquidation("");
    setMarketName("");
    setMedicalShopName("");
  };

  const handleSubmit = () => {
    if (!product || !doctor || !targetLiquidation || !marketName) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (Number(targetLiquidation) > quantity) {
      toast({
        title: "Error",
        description: "Target liquidation cannot exceed available quantity",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      product,
      quantity,
      doctor,
      targetLiquidation: Number(targetLiquidation),
      achievedUnits: editData?.achievedUnits || 0,
      marketName,
      medicalShopName: medicalShopName || undefined,
      status: editData?.status || "PENDING",
    });

    toast({
      title: "Success",
      description: editData
        ? "Liquidation plan updated successfully"
        : "Liquidation plan added successfully",
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Liquidation Plan" : "Add New Liquidation Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity (Auto-filled) */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Available Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Auto-filled from inventory
            </p>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label>Doctor *</Label>
            <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={doctorOpen}
                  className="w-full justify-between"
                >
                  {doctor || "Select a doctor..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search doctor..." />
                  <CommandList>
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                      {mockDoctors.map((d) => (
                        <CommandItem
                          key={d}
                          value={d}
                          onSelect={() => {
                            setDoctor(d);
                            setDoctorOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              doctor === d ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {d}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Target Liquidation */}
          <div className="space-y-2">
            <Label htmlFor="targetLiquidation">Target Liquidation (Qty) *</Label>
            <Input
              id="targetLiquidation"
              type="number"
              placeholder="Enter target quantity"
              value={targetLiquidation}
              onChange={(e) => setTargetLiquidation(e.target.value)}
              max={quantity}
            />
          </div>

          {/* Market Name */}
          <div className="space-y-2">
            <Label htmlFor="marketName">Market Name *</Label>
            <Input
              id="marketName"
              placeholder="Enter market name"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
            />
          </div>

          {/* Medical Shop Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="medicalShopName">Medical Shop Name (Optional)</Label>
            <Input
              id="medicalShopName"
              placeholder="Enter medical shop name"
              value={medicalShopName}
              onChange={(e) => setMedicalShopName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editData ? "Update Plan" : "Add Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLiquidationModal;
