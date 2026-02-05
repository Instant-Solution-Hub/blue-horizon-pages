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
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 
 interface Product {
   id: string;
   name: string;
   category: string;
   description: string;
   price: number;
   pts: number;
   ptr: number;
 }
 
 interface UpdateProductModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onUpdate: (product: Product) => void;
   product: Product | null;
   categories: string[];
 }
 
 const UpdateProductModal = ({
   open,
   onOpenChange,
   onUpdate,
   product,
   categories,
 }: UpdateProductModalProps) => {
   const [formData, setFormData] = useState<Product>({
     id: "",
     name: "",
     category: "",
     description: "",
     price: 0,
     pts: 0,
     ptr: 0,
   });
 
   useEffect(() => {
     if (product) {
       setFormData(product);
     }
   }, [product]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
    if (!formData.category) {
      return;
    }
     onUpdate(formData);
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Update Product</DialogTitle>
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
             <Button type="submit">Update Product</Button>
           </div>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default UpdateProductModal;