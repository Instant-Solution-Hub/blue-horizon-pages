import { Edit, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/services/ProductService";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductList = ({ products, onEdit }: ProductListProps) => {
  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-lg shadow-indigo-100 overflow-hidden">
      <Table>
        {/* Applied the specific RGB color here */}
        <TableHeader className="bg-[rgb(61,83,209)]">
          <TableRow className="hover:bg-[rgb(61,83,209)] border-none">
            <TableHead className="text-white font-semibold h-12">Name</TableHead>
            <TableHead className="text-white font-semibold">Category</TableHead>
            <TableHead className="text-white font-semibold">Description</TableHead>
            <TableHead className="text-right text-white font-semibold">Price (₹)</TableHead>
            <TableHead className="text-right text-white font-semibold">PTS (₹)</TableHead>
             <TableHead className="text-right text-white font-semibold">New PTS (₹)</TableHead>
            <TableHead className="text-right text-white font-semibold">PTR (₹)</TableHead>
            <TableHead className="text-center text-white font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow 
              key={product.id} 
              className="border-b-blue-50 transition-colors hover:bg-blue-50 even:bg-blue-50/30"
            >
              <TableCell className="font-semibold text-slate-700">
                {product.name}
              </TableCell>
              <TableCell>
                {/* Updated badge to match the new blue tone */}
                <span className="inline-flex items-center rounded-md bg-[rgb(61,83,209)]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(61,83,209)]">
                  {product.category}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-slate-500">
                {product.description}
              </TableCell>
              <TableCell className="text-right font-medium text-slate-700">
                {product.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-slate-600">
                {product.pts.toFixed(2)}
              </TableCell>
                <TableCell className="text-right text-slate-600">
                  {product.newPts.toFixed(2)}
                </TableCell>
              <TableCell className="text-right text-slate-600">
                {product.ptr.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                  className="text-slate-400 hover:text-[rgb(61,83,209)] hover:bg-[rgb(61,83,209)]/10 rounded-full h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <PackageOpen className="h-10 w-10 text-[rgb(61,83,209)]/40" />
                  <p className="text-lg font-medium text-slate-600">No products found</p>
                  <p className="text-sm">Add your first product to get started.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;