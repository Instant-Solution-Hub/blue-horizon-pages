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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { CalendarIcon, Plus, Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface ProductRow {
  id: string;
  productName: string;
  qty: number;
  price: number;
  total: number;
}

export interface POBFormData {
  id?: string;
  doctorName: string;
  hospitalName: string;
  orderDate: Date;
  products: ProductRow[];
  totalValue: number;
  discount: number;
  notes: string;
  status?: "pending" | "confirmed" | "cancelled";
}

interface AddPOBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: POBFormData) => void;
  editData?: POBFormData | null;
}

const mockProducts = [
  { name: "Paracetamol 500mg", price: 25 },
  { name: "Amoxicillin 250mg", price: 45 },
  { name: "Omeprazole 20mg", price: 35 },
  { name: "Metformin 500mg", price: 30 },
  { name: "Atorvastatin 10mg", price: 55 },
  { name: "Amlodipine 5mg", price: 40 },
  { name: "Losartan 50mg", price: 50 },
  { name: "Vitamin D3 1000IU", price: 60 },
];

const mockDoctors = [
  "Dr. Rajesh Kumar",
  "Dr. Priya Sharma",
  "Dr. Amit Patel",
  "Dr. Sunita Gupta",
  "Dr. Vikram Singh",
];

const mockHospitals = [
  "City Hospital",
  "Apollo Clinic",
  "Fortis Healthcare",
  "Max Hospital",
  "Medanta Pharmacy",
  "Life Care Clinic",
];

const AddPOBModal = ({ isOpen, onClose, onSubmit, editData }: AddPOBModalProps) => {
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [orderDate, setOrderDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  
  // New product row state
  const [newProduct, setNewProduct] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [productOpen, setProductOpen] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setDoctorName(editData.doctorName);
      setHospitalName(editData.hospitalName);
      setOrderDate(editData.orderDate);
      setNotes(editData.notes);
      setDiscount(editData.discount || 0);
      setProducts(editData.products);
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setDoctorName("");
    setHospitalName("");
    setOrderDate(undefined);
    setNotes("");
    setDiscount(0);
    setProducts([]);
    setNewProduct("");
    setNewQty(1);
  };

  const getProductPrice = (productName: string) => {
    const product = mockProducts.find(p => p.name === productName);
    return product?.price || 0;
  };

  const addProductRow = () => {
    if (!newProduct || newQty <= 0) return;
    
    const price = getProductPrice(newProduct);
    const newRow: ProductRow = {
      id: Date.now().toString(),
      productName: newProduct,
      qty: newQty,
      price: price,
      total: price * newQty,
    };
    
    setProducts([...products, newRow]);
    setNewProduct("");
    setNewQty(1);
  };

  const removeProductRow = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProductQty = (id: string, qty: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, qty, total: p.price * qty };
      }
      return p;
    }));
  };

  const subtotal = products.reduce((sum, p) => sum + p.total, 0);
  const totalOrderValue = subtotal - discount;

  const handleSubmit = () => {
    if (!doctorName || !hospitalName || !orderDate || products.length === 0) return;
    
    onSubmit({
      id: editData?.id,
      doctorName,
      hospitalName,
      orderDate,
      products,
      totalValue: totalOrderValue,
      discount,
      notes,
      status: editData?.status || "pending",
    });
    
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const filteredDoctors = mockDoctors.filter(d => 
    d.toLowerCase().includes(doctorName.toLowerCase())
  );

  const filteredHospitals = mockHospitals.filter(h => 
    h.toLowerCase().includes(hospitalName.toLowerCase())
  );

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(newProduct.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit POB Order" : "Add New POB Order"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Doctor/Pharmacist Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Doctor/Pharmacist Name *</Label>
              <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {doctorName || "Select doctor..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search doctor..." 
                      value={doctorName}
                      onValueChange={setDoctorName}
                    />
                    <CommandList>
                      <CommandEmpty>No doctor found.</CommandEmpty>
                      <CommandGroup>
                        {filteredDoctors.map((doctor) => (
                          <CommandItem
                            key={doctor}
                            onSelect={() => {
                              setDoctorName(doctor);
                              setDoctorOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                doctorName === doctor ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {doctor}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Hospital/Pharmacy Name */}
            <div className="space-y-2">
              <Label>Pharmacy/Hospital Name *</Label>
              <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {hospitalName || "Select hospital..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search hospital..." 
                      value={hospitalName}
                      onValueChange={setHospitalName}
                    />
                    <CommandList>
                      <CommandEmpty>No hospital found.</CommandEmpty>
                      <CommandGroup>
                        {filteredHospitals.map((hospital) => (
                          <CommandItem
                            key={hospital}
                            onSelect={() => {
                              setHospitalName(hospital);
                              setHospitalOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                hospitalName === hospital ? "opacity-100" : "opacity-0"
                              )}
                            />
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

          {/* Date of Order */}
          <div className="space-y-2">
            <Label>Date of Order *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !orderDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {orderDate ? format(orderDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={orderDate}
                  onSelect={setOrderDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Details Table */}
          <div className="space-y-2">
            <Label>Product Details *</Label>
            
            {/* Add new product row */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Popover open={productOpen} onOpenChange={setProductOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {newProduct || "Select product..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search product..." 
                        value={newProduct}
                        onValueChange={setNewProduct}
                      />
                      <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {filteredProducts.map((product) => (
                            <CommandItem
                              key={product.name}
                              onSelect={() => {
                                setNewProduct(product.name);
                                setProductOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newProduct === product.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {product.name} - ₹{product.price}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  min="1"
                  value={newQty}
                  onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                />
              </div>
              <Button onClick={addProductRow} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Products Table */}
            {products.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="w-24 text-center">Qty</TableHead>
                      <TableHead className="w-28 text-right">Price</TableHead>
                      <TableHead className="w-28 text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="1"
                            value={product.qty}
                            onChange={(e) => updateProductQty(product.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right">₹{product.price}</TableCell>
                        <TableCell className="text-right font-medium">₹{product.total}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProductRow(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        Subtotal:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{subtotal.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Discount (₹)</Label>
            <Input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Math.min(parseInt(e.target.value) || 0, subtotal))}
              placeholder="Enter discount amount"
            />
            {products.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold">Final Total (after discount):</span>
                <span className="text-xl font-bold text-primary">₹{totalOrderValue.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!doctorName || !hospitalName || !orderDate || products.length === 0}
          >
            {editData ? "Update Order" : "Submit Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPOBModal;