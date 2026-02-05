 import { Edit } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 
 interface Product {
   id: string;
   name: string;
   category: string;
   description: string;
   price: number;
   pts: number;
   ptr: number;
 }
 
 interface ProductListProps {
   products: Product[];
   onEdit: (product: Product) => void;
 }
 
 const ProductList = ({ products, onEdit }: ProductListProps) => {
   return (
     <div className="rounded-lg border bg-card">
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Name</TableHead>
             <TableHead>Category</TableHead>
             <TableHead>Description</TableHead>
             <TableHead className="text-right">Price (₹)</TableHead>
             <TableHead className="text-right">PTS (₹)</TableHead>
             <TableHead className="text-right">PTR (₹)</TableHead>
             <TableHead className="text-center">Actions</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {products.map((product) => (
             <TableRow key={product.id}>
               <TableCell className="font-medium">{product.name}</TableCell>
               <TableCell>{product.category}</TableCell>
               <TableCell className="max-w-[200px] truncate">
                 {product.description}
               </TableCell>
               <TableCell className="text-right">
                 {product.price.toFixed(2)}
               </TableCell>
               <TableCell className="text-right">
                 {product.pts.toFixed(2)}
               </TableCell>
               <TableCell className="text-right">
                 {product.ptr.toFixed(2)}
               </TableCell>
               <TableCell className="text-center">
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => onEdit(product)}
                 >
                   <Edit className="h-4 w-4" />
                 </Button>
               </TableCell>
             </TableRow>
           ))}
           {products.length === 0 && (
             <TableRow>
               <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                 No products found. Add your first product to get started.
               </TableCell>
             </TableRow>
           )}
         </TableBody>
       </Table>
     </div>
   );
 };
 
 export default ProductList;