 import { useState } from "react";
 import { Plus } from "lucide-react";
 import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
 import { Button } from "@/components/ui/button";
 import ProductList from "@/components/admin-products/ProductList";
 import AddProductModal from "@/components/admin-products/AddProductModal";
 import UpdateProductModal from "@/components/admin-products/UpdateProductModal";
 import { useToast } from "@/hooks/use-toast";
 
 interface Product {
   id: string;
   name: string;
   category: string;
   description: string;
   price: number;
   pts: number;
   ptr: number;
 }
 
 const categories = [
   "Antibiotics",
   "Painkillers",
   "Vitamins",
   "Cardiovascular",
   "Diabetes",
   "Respiratory",
   "Gastrointestinal",
   "Dermatology",
   "Neurology",
   "Other",
 ];
 
 // Mock data for demonstration
 const mockProducts: Product[] = [
   {
     id: "1",
     name: "Amoxicillin 500mg",
     category: "Antibiotics",
     description: "Broad-spectrum antibiotic for bacterial infections",
     price: 150.0,
     pts: 120.0,
     ptr: 135.0,
   },
   {
     id: "2",
     name: "Paracetamol 650mg",
     category: "Painkillers",
     description: "Pain relief and fever reduction",
     price: 25.0,
     pts: 18.0,
     ptr: 22.0,
   },
   {
     id: "3",
     name: "Vitamin D3 60K",
     category: "Vitamins",
     description: "Cholecalciferol supplement for vitamin D deficiency",
     price: 120.0,
     pts: 95.0,
     ptr: 108.0,
   },
 ];
 
 const AdminProducts = () => {
   const { toast } = useToast();
   const [products, setProducts] = useState<Product[]>(mockProducts);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 
   const handleAddProduct = (productData: Omit<Product, "id">) => {
     const newProduct: Product = {
       ...productData,
       id: Date.now().toString(),
     };
     setProducts([...products, newProduct]);
     toast({
       title: "Product Added",
       description: `${productData.name} has been added successfully.`,
     });
   };
 
   const handleUpdateProduct = (updatedProduct: Product) => {
     setProducts(
       products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
     );
     toast({
       title: "Product Updated",
       description: `${updatedProduct.name} has been updated successfully.`,
     });
   };
 
   const handleEditClick = (product: Product) => {
     setSelectedProduct(product);
     setIsUpdateModalOpen(true);
   };
 
   return (
     <div className="flex min-h-screen bg-background">
       <AdminSidebar />
       <main className="flex-1 p-6">
         <div className="mb-6">
           <h1 className="text-2xl font-bold text-foreground">Products</h1>
           <p className="text-muted-foreground">
             Manage your product catalog
           </p>
         </div>
 
         <div className="flex justify-end mb-4">
           <Button onClick={() => setIsAddModalOpen(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Add Product
           </Button>
         </div>
 
         <ProductList products={products} onEdit={handleEditClick} />
 
         <AddProductModal
           open={isAddModalOpen}
           onOpenChange={setIsAddModalOpen}
           onAdd={handleAddProduct}
           categories={categories}
         />
 
         <UpdateProductModal
           open={isUpdateModalOpen}
           onOpenChange={setIsUpdateModalOpen}
           onUpdate={handleUpdateProduct}
           product={selectedProduct}
           categories={categories}
         />
       </main>
     </div>
   );
 };
 
 export default AdminProducts;