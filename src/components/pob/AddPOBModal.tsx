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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { CalendarIcon, Plus, Trash2 , Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { getProducts } from "@/services/ProductService";


export interface ProductRow {
  id: string;        // UI-only
  productId: number; // backend ID
  productName: string;
  qty: number;
  price: number;
  total: number;
}


export interface POBFormData {
  institutionName: string;
  institutionType: "HOSPITAL" | "CLINIC" | "PHARMACY";
  contactPerson: string;
  contactNumber: string;
  orderDate: Date;
  discount: number;
  notes: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount:number;
}


interface OrderItemRequest {
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

interface AddPOBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: POBFormData) => void;
  editData?: POBFormData | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
}




const AddPOBModal = ({ isOpen, onClose, onSubmit, editData }: AddPOBModalProps) => {
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [orderDate, setOrderDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [productsMaster, setProductsMaster] = useState<Product[]>([]);
const [loadingProducts, setLoadingProducts] = useState(false);
  
  // New product row state
  const [newProduct, setNewProduct] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
  if (!isOpen) {
    return;
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await getProducts();
    

      setProductsMaster(res || []);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchProducts();
}, [isOpen]);


  // Populate form when editing
  // useEffect(() => {
  //   if (editData) {
  //     setDoctorName(editData.institutionName);
  //     setHospitalName(editData.institutionType);
  //     setOrderDate(editData.orderDate);
  //     setNotes(editData.notes);
  //     setDiscount(editData.discount || 0);
  //     setProducts(editData.items);
  //   } else {
  //     resetForm();
  //   }
  // }, [editData, isOpen]);

  useEffect(() => {
  if (!editData) return;

  setDoctorName(editData.contactPerson);
  setHospitalName(editData.institutionName);
  setOrderDate(editData.orderDate);
  setNotes(editData.notes);
  setDiscount(editData.discount);

  setProducts(
    editData.items.map(item => ({
      id: crypto.randomUUID(),
      productId: item.productId,
      productName: productsMaster.find(p => p.id === item.productId)?.name || "",
      qty: item.quantity,
      price: item.price,
      total: item.total,
    }))
  );
}, [editData, productsMaster]);


  const resetForm = () => {
    setDoctorName("");
    setHospitalName("");
    setOrderDate(undefined);
    setNotes("");
    setDiscount(0);
    setProducts([]);
    setNewProduct("");
    setNewQty(1);
    setSelectedProduct(null);
  };


const addProductRow = () => {
  if (!selectedProduct || newQty <= 0) return;

  const newRow: ProductRow = {
    id: Date.now().toString(),
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    qty: newQty,
    price: selectedProduct.price,
    total: selectedProduct.price * newQty,
  };

  setProducts([...products, newRow]);
  setNewProduct("");
  setSelectedProduct(null);
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
  if (
    !doctorName ||
    !hospitalName ||
    !orderDate ||
    products.length === 0
  ) return;


onSubmit({
  institutionName: hospitalName,
  institutionType: "HOSPITAL",
  contactPerson: doctorName,
  contactNumber: "9999999999",
  orderDate,
  discount,
  totalAmount:totalOrderValue,
  notes,
  items: products.map(p => ({
    productId: p.productId,
    quantity: p.qty,
    price: p.price,
    total: p.total,
  })),
});
onClose();
 resetForm();
};


  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedProductIds = new Set(products.map(p => p.productId));


const filteredProducts = productsMaster
  .filter(p => !selectedProductIds.has(p.id)) // 🚫 exclude already added
  .filter(p =>
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
  <Label>Doctor / Pharmacist Name *</Label>
  <Input
    value={doctorName}
    onChange={(e) => setDoctorName(e.target.value)}
    placeholder="Enter doctor or pharmacist name"
    required
  />
</div>

            {/* Hospital/Pharmacy Name */}
          <div className="space-y-2">
  <Label>Pharmacy / Hospital Name *</Label>
  <Input
    value={hospitalName}
    onChange={(e) => setHospitalName(e.target.value)}
    placeholder="Enter pharmacy or hospital name"
    required
  />
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
  onSelect={(date) => {
    if (!date) return;
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    setOrderDate(d);
  }}
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
  setSelectedProduct(product);
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