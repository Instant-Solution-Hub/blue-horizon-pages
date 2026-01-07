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
  id: string;
  brandName: string;
  companyName: string;
  product: string;
  productCategory: string;
  doctorName: string;
  hospitalName: string;
  observations: string;
  date: Date;
  imageUrl?: string;
  managerNotified: boolean;
}

interface AddReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: Omit<CompetitiveReport, "id" | "managerNotified">) => void;
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
  const [product, setProduct] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [observations, setObservations] = useState("");
  const [date, setDate] = useState<Date>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const [doctorOpen, setDoctorOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    if (editingReport) {
      setBrandName(editingReport.brandName);
      setCompanyName(editingReport.companyName);
      setProduct(editingReport.product);
      setProductCategory(editingReport.productCategory);
      setDoctorName(editingReport.doctorName);
      setHospitalName(editingReport.hospitalName);
      setObservations(editingReport.observations);
      setDate(editingReport.date);
      setImageUrl(editingReport.imageUrl || "");
      setImagePreview(editingReport.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editingReport, open]);

  const resetForm = () => {
    setBrandName("");
    setCompanyName("");
    setProduct("");
    setProductCategory("");
    setDoctorName("");
    setHospitalName("");
    setObservations("");
    setDate(undefined);
    setImageUrl("");
    setImagePreview("");
  };

  const handleProductSelect = (productName: string) => {
    setProduct(productName);
    const selectedProduct = mockProducts.find((p) => p.name === productName);
    if (selectedProduct) {
      setProductCategory(selectedProduct.category);
    }
    setProductOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setImagePreview("");
  };

  const handleSubmit = () => {
    if (!brandName || !companyName || !doctorName || !hospitalName || !date) {
      return;
    }

    onSubmit({
      brandName,
      companyName,
      product,
      productCategory,
      doctorName,
      hospitalName,
      observations,
      date,
      imageUrl: imageUrl || undefined,
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
              <Label>Product</Label>
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start font-normal"
                  >
                    {product || "Select product"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {mockProducts.map((p) => (
                          <CommandItem
                            key={p.name}
                            onSelect={() => handleProductSelect(p.name)}
                          >
                            {p.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategory">Product Category</Label>
              <Input
                id="productCategory"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="Auto-filled"
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Doctor *</Label>
              <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start font-normal"
                  >
                    {doctorName || "Select doctor"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search doctor..." />
                    <CommandList>
                      <CommandEmpty>No doctor found.</CommandEmpty>
                      <CommandGroup>
                        {mockDoctors.map((doctor) => (
                          <CommandItem
                            key={doctor}
                            onSelect={() => {
                              setDoctorName(doctor);
                              setDoctorOpen(false);
                            }}
                          >
                            {doctor}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Hospital *</Label>
              <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start font-normal"
                  >
                    {hospitalName || "Select hospital"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search hospital..." />
                    <CommandList>
                      <CommandEmpty>No hospital found.</CommandEmpty>
                      <CommandGroup>
                        {mockHospitals.map((hospital) => (
                          <CommandItem
                            key={hospital}
                            onSelect={() => {
                              setHospitalName(hospital);
                              setHospitalOpen(false);
                            }}
                          >
                            {hospital}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
