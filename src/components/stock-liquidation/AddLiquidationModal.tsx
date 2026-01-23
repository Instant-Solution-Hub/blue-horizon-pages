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
import { fetchDoctorsByFE } from "@/services/DoctorService";
import { getFEProductStock } from "@/services/StockService";
import { getProducts } from "@/services/ProductService";
import { createLiquidationPlan } from "@/services/LiquidationService";
import { getAllocatedProducts } from "@/services/StockService";

export interface ProductStockData {
   id: number;
  name: string;
  totalQty: number;
  availableQty: number;
}


export interface LiquidationPlan {
  id: string;
  productId: number;      // 🔥 REQUIRED
  doctorId: number;       // 🔥 REQUIRED
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

export interface FEProductStock {
  productId: number;
  productName: string;
  allocatedQuantity: number;
  remainingQuantity: number;
}

export interface Product {
  id: number;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalName: string;

}

interface AddLiquidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any , quantity : number
  ) => Promise<void>;
  editData?: LiquidationPlan | null;
  feId: number;
  plans : LiquidationPlan[]
    stockData: ProductStockData[];
}






const AddLiquidationModal = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  feId,
  plans
}: AddLiquidationModalProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(0);
  const [targetLiquidation, setTargetLiquidation] = useState("");
  const [marketName, setMarketName] = useState("");
  const [medicalShopName, setMedicalShopName] = useState("");
  const [doctorOpen, setDoctorOpen] = useState(false);
const [products, setProducts] = useState<FEProductStock[]>([]);
const [doctors, setDoctors] = useState<Doctor[]>([]);
const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

const [productName, setProductName] = useState("");
const [doctorName, setDoctorName] = useState("");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const deadline = tomorrow.toISOString().replace("Z", "");

const getExistingTotalForProduct = () => {
  if (!selectedProductId) return 0;

  return plans
    .filter(
      (p) =>
        p.productId === selectedProductId 
    )
    .reduce((sum, p) => sum + p.targetLiquidation, 0);
};





  useEffect(() => {
    if (editData) {
      setProductName(editData.product);
      setQuantity(editData.quantity);
      setDoctorName(editData.doctor);
      setTargetLiquidation(editData.targetLiquidation.toString());
      setMarketName(editData.marketName);
      setMedicalShopName(editData.medicalShopName || "");
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

useEffect(() => {
    if (!isOpen) return;

    fetchDoctorsByFE(feId)
      .then(setDoctors)
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        })
      );
  }, [isOpen, feId]);


useEffect(() => {
  if (!isOpen) return;

  getAllocatedProducts(feId)
    .then(setProducts)
    .catch(() =>
      toast({
        title: "Error",
        description: "Failed to load allocated products",
        variant: "destructive",
      })
    );
}, [isOpen, feId]);


  const resetForm = () => {
    setProductName("");
    setQuantity(0);
    setDoctorName("");
    setTargetLiquidation("");
    setMarketName("");
    setMedicalShopName("");
    setSelectedDoctorId(null);
    setSelectedProductId(null);
  };

const handleSubmit = async () => {
  if (!selectedProductId || !selectedDoctorId || !targetLiquidation || !marketName) {
    toast({
      title: "Error",
      description: "Please fill all required fields",
      variant: "destructive",
    });
    return;
  }

  const entered = Number(targetLiquidation);
  const existingTotal = getExistingTotalForProduct();

  if (existingTotal + entered > quantity) {
    toast({
      title: "Invalid quantity",
      description: "Total liquidation exceeds available stock",
      variant: "destructive",
    });
    return;
  }

  await onSubmit(
    {
      productId: selectedProductId,
      doctorId: selectedDoctorId,
      marketName,
      medicalShopName: medicalShopName || undefined,
      targetLiquidation: entered,
      deadline,
      strategy: "",
    },
    quantity
  );

  resetForm();
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
            <Select value={selectedProductId?.toString()} onValueChange={async (value) => {
    const productId = Number(value);
    setSelectedProductId(productId);

    const stock = await getFEProductStock(feId, productId);
    setProductName(stock.productName);
    setQuantity(stock.remainingQuantity);
  }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                 {products.map((p) => (
    <SelectItem key={p.productId} value={p.productId.toString()}>
      {p.productName} 
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
                  {doctorName || "Select a doctor..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search doctor..." />
                  <CommandList>
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                     {doctors.map((d) => (
  <CommandItem
    key={d.id}
    value={d.name}
    onSelect={() => {
        setSelectedDoctorId(Number(d.id));
      setDoctorName(d.name);
      setDoctorOpen(false);
    }}
  >
    <Check
      className={cn(
        "mr-2 h-4 w-4",
        doctorName === d.name ? "opacity-100" : "opacity-0"
      )}
    />
    {d.name}
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
              onChange={(e) => {
    const entered = Number(e.target.value);
    const existingTotal = getExistingTotalForProduct();
    const maxAllowed = quantity - existingTotal;

    if (entered > maxAllowed) {
      toast({
        title: "Invalid quantity",
        description: `You can allocate only ${maxAllowed} more units for this doctor.`,
        variant: "destructive",
      });
      return; // 🚫 block typing
    }

    setTargetLiquidation(e.target.value);
  }}
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
