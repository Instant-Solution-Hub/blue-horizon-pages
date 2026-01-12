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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitiveReport {
  id: number;
  brandName: string;
  companyName: string;
  productName?: string;
  productCategory: string;
  source: string;
  designation: string;
  observations?: string;
  imageUrl?: string;
  managerNotified: boolean;
  createdAt:string;
}

interface AddReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    data: any;
    image?: File | null;
  }) => void;
  editingReport?: CompetitiveReport | null;
}


const mockDoctors = [
  "Dr. Amit Sharma",
  "Dr. Priya Patel",
  "Dr. Rajesh Kumar",
  "Dr. Sunita Verma",
  "Dr. Vikram Singh",
];

const mockHospitals = [
  "City Hospital",
  "Apollo Clinic",
  "Max Healthcare",
  "Fortis Hospital",
  "AIIMS Delhi",
];

const mockProducts = [
  { name: "Competitor Drug A", category: "Antibiotics" },
  { name: "Competitor Drug B", category: "Pain Relief" },
  { name: "Competitor Drug C", category: "Cardiovascular" },
  { name: "Competitor Drug D", category: "Diabetes" },
  { name: "Competitor Drug E", category: "Respiratory" },
];

const AddReportModal = ({
  open,
  onOpenChange,
  onSubmit,
  editingReport,
}: AddReportModalProps) => {
const [brandName, setBrandName] = useState("");
const [companyName, setCompanyName] = useState("");
const [productName, setProductName] = useState("");
const [productCategory, setProductCategory] = useState("");
const [source, setSource] = useState("");
const [designation, setDesignation] = useState("");
const [observations, setObservations] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>("");
const fieldExecutiveId = Number(localStorage.getItem("feId")) || 1;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

useEffect(() => {
  if (editingReport) {
    setBrandName(editingReport.brandName);
    setCompanyName(editingReport.companyName);
    setProductName(editingReport.productName);
    setProductCategory(editingReport.productCategory);
    setSource(editingReport.source);
    setDesignation(editingReport.designation);
    setObservations(editingReport.observations);
    setImageFile(null);
     setImagePreview(
      editingReport.imageUrl
        ? `${API_BASE_URL}${editingReport.imageUrl}`
        : ""
    );
  } else {
    resetForm();
  }
}, [editingReport, open]);

const resetForm = () => {
  setBrandName("");
  setCompanyName("");
  setProductName("");
  setProductCategory("");
  setSource("");
  setDesignation("");
  setObservations("");
  setImageFile(null);
  setImagePreview("");
};




 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
};


 const removeImage = () => {
  setImageFile(null);
  setImagePreview("");
    if (editingReport) {
    setImageFile(null);
  }
};

const handleSubmit = () => {
  if (!brandName || !companyName || !productCategory || !source || !designation) {
    return;
  }

  onSubmit({
    data: {
      fieldExecutiveId,
      brandName,
      companyName,
      productName: productName || null,
      productCategory,
      source,
      designation,
      observations,
      
    },
    image: imageFile,
  });

  resetForm();
  onOpenChange(false);
};



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingReport ? "Edit Report" : "Add Competitive Brand Report"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label>Product Name</Label>
    <Input
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      placeholder="Enter product name (optional)"
    />
  </div>

  <div className="space-y-2">
    <Label>Product Category *</Label>
    <Input
      value={productCategory}
      onChange={(e) => setProductCategory(e.target.value)}
      placeholder="Enter product category"
    />
  </div>
</div>

         <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label>Source *</Label>
    <Input
      value={source}
      onChange={(e) => setSource(e.target.value)}
      placeholder="Name of the person"
    />
  </div>

  <div className="space-y-2">
    <Label>Designation *</Label>
    <Input
      value={designation}
      onChange={(e) => setDesignation(e.target.value)}
      placeholder="Doctor / Pharmacist / Distributor"
    />
  </div>
</div>


      

          <div className="space-y-2">
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Enter your observations..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Image</Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer text-primary hover:underline"
                >
                  Click to upload image
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingReport ? "Update Report" : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportModal;



