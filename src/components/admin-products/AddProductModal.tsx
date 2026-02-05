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
 
 interface ProductFormData {
   name: string;
   category: string;
   description: string;
   price: number;
   pts: number;
   ptr: number;
 }
 
 interface AddProductModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onAdd: (product: ProductFormData) => void;
   categories: string[];
 }
 
 const AddProductModal = ({
   open,
   onOpenChange,
   onAdd,
   categories,
 }: AddProductModalProps) => {
   const [formData, setFormData] = useState<ProductFormData>({
     name: "",
     category: "",
     description: "",
     price: 0,
     pts: 0,
     ptr: 0,
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
    if (!formData.category) {
      return;
    }
     onAdd(formData);
     setFormData({
       name: "",
       category: "",
       description: "",
       price: 0,
       pts: 0,
       ptr: 0,
     });
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Add New Product</DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="name">Product Name</Label>
             <Input
               id="name"
               value={formData.name}
               onChange={(e) =>
                 setFormData({ ...formData, name: e.target.value })
               }
               placeholder="Enter product name"
               required
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="category">Category</Label>
             <Select
               value={formData.category}
               onValueChange={(value) =>
                 setFormData({ ...formData, category: value })
               }
             >
                <SelectTrigger className={!formData.category ? "border-destructive" : ""}>
                 <SelectValue placeholder="Select category" />
               </SelectTrigger>
               <SelectContent>
                 {categories.map((category) => (
                   <SelectItem key={category} value={category}>
                     {category}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
             <Textarea
               id="description"
               value={formData.description}
               onChange={(e) =>
                 setFormData({ ...formData, description: e.target.value })
               }
               placeholder="Enter product description"
               rows={3}
             />
           </div>
 
           <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
               <Label htmlFor="price">Price (₹)</Label>
               <Input
                 id="price"
                 type="number"
                 step="0.01"
                 min="0"
                 value={formData.price}
                 onChange={(e) =>
                   setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                 }
                 required
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="pts">PTS (₹)</Label>
               <Input
                 id="pts"
                 type="number"
                 step="0.01"
                 min="0"
                 value={formData.pts}
                 onChange={(e) =>
                   setFormData({ ...formData, pts: parseFloat(e.target.value) || 0 })
                 }
                 required
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="ptr">PTR (₹)</Label>
               <Input
                 id="ptr"
                 type="number"
                 step="0.01"
                 min="0"
                 value={formData.ptr}
                 onChange={(e) =>
                   setFormData({ ...formData, ptr: parseFloat(e.target.value) || 0 })
                 }
                 required
               />
             </div>
           </div>
 
           <div className="flex justify-end gap-2 pt-4">
             <Button
               type="button"
               variant="outline"
               onClick={() => onOpenChange(false)}
             >
               Cancel
             </Button>
             <Button type="submit">Add Product</Button>
           </div>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default AddProductModal;