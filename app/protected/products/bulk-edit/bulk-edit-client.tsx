"use client";

import * as React from "react";
import { Product } from "@/utils/squarespace/client";
import { ProductDataTable } from "../_components/product-data-table";
import { createProductColumns } from "../_components/product-columns";
import { BulkActionsBar } from "../_components/bulk-actions-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProduct, bulkUpdateVisibility, bulkUpdatePrices, bulkDeleteProducts, bulkUpdateTags, bulkUpdateCategories } from "./actions";
import { toast } from "sonner";

interface BulkEditClientProps {
  initialProducts: Product[];
}

export function BulkEditClient({ initialProducts }: BulkEditClientProps) {
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleUpdate = React.useCallback(async (id: string, field: string, value: any) => {
    try {
      const updatedProduct = await updateProduct(id, field, value);
      
      if (updatedProduct) {
        // Update with actual server data
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
      }
      
      toast.success("Product updated successfully");
    } catch (error) {
        toast.error("Failed to update product");
      console.error("Update error:", error);
    }
  }, []);

  const handleBulkVisibilityUpdate = React.useCallback(
    async (visible: boolean) => {
      const ids = selectedProducts.map((p) => p.id);
      const result = await bulkUpdateVisibility(ids, visible);
      
      if (result.success.length > 0) {
        // Optimistic update
        setProducts((prev) =>
          prev.map((p) =>
            result.success.includes(p.id) ? { ...p, isVisible: visible } : p
          )
        );
        toast.success(`${result.success.length} product(s) updated`);
      }
      
      if (result.failed.length > 0) {
        toast.error(`Failed to update ${result.failed.length} product(s)`);
        for (const fail of result.failed) {
            toast.error(`Product ID ${fail.id} update failed: ${fail.error}`);
        }
      }
    },
    [selectedProducts]
  );

  const handleBulkPriceUpdate = React.useCallback(
    async (adjustment: { type: "percent" | "fixed"; value: number }) => {
      const ids = selectedProducts.map((p) => p.id);
      const result = await bulkUpdatePrices(ids, adjustment);
      
      if (result.success.length > 0) {
        toast.success(`${result.success.length} product(s) prices updated`);
        router.refresh(); // Refresh to get updated prices
      }
      
      if (result.failed.length > 0) {
        toast.error(`Failed to update ${result.failed.length} product(s)`);
        for (const fail of result.failed) {
            toast.error(`Product ID ${fail.id} update failed: ${fail.error}`);
        }
      }
    },
    [selectedProducts, router]
  );

  const handleBulkDelete = React.useCallback(async () => {
    const ids = selectedProducts.map((p) => p.id);
    const result = await bulkDeleteProducts(ids);
    
    if (result.success.length > 0) {
      // Remove deleted products
      setProducts((prev) => prev.filter((p) => !result.success.includes(p.id)));
      toast.success(`${result.success.length} product(s) deleted`);
    }
    
    if (result.failed.length > 0) {
        toast.error(`Failed to delete ${result.failed.length} product(s)`);
        for (const fail of result.failed) {
            toast.error(`Product ID ${fail.id} update failed: ${fail.error}`);
        }
    }
  }, [selectedProducts]);

  const handleBulkTagsUpdate = React.useCallback(
    async (action: "add" | "remove", tags: string[]) => {
      const ids = selectedProducts.map((p) => p.id);
      const result = await bulkUpdateTags(ids, action, tags);
      
      if (result.success.length > 0) {
        // Update products with actual data from server
        setProducts((prev) => {
          const updatedMap = new Map(result.updatedProducts.map(p => [p.id, p]));
          return prev.map(p => updatedMap.get(p.id) || p);
        });
        toast.success(`${result.success.length} product(s) tags updated`);
      }
      
      if (result.failed.length > 0) {
        toast.error(`Failed to update ${result.failed.length} product(s)`);
        for (const fail of result.failed) {
            toast.error(`Product ID ${fail.id} update failed: ${fail.error}`);
        }
      }
    },
    [selectedProducts]
  );

  const handleBulkCategoriesUpdate = React.useCallback(
    async (action: "add" | "remove", categories: string[]) => {
      const ids = selectedProducts.map((p) => p.id);
      const result = await bulkUpdateCategories(ids, action, categories);
      
      if (result.success.length > 0) {
        // Update products with actual data from server
        setProducts((prev) => {
          const updatedMap = new Map(result.updatedProducts.map(p => [p.id, p]));
          return prev.map(p => updatedMap.get(p.id) || p);
        });
        toast.success(`${result.success.length} product(s) categories updated`);
      }
      
      if (result.failed.length > 0) {
        toast.error(`Failed to update ${result.failed.length} product(s)`);
        for (const fail of result.failed) {
            toast.error(`Product ID ${fail.id} update failed: ${fail.error}`);
        }
      }
    },
    [selectedProducts]
  );

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [router]);

  const columns = React.useMemo(() => createProductColumns(handleUpdate), [handleUpdate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/protected/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bulk Product Editor</h1>
            <p className="text-muted-foreground">
              Edit multiple products at once with inline editing
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <BulkActionsBar
        selectedProducts={selectedProducts}
        onUpdateVisibility={handleBulkVisibilityUpdate}
        onUpdatePrices={handleBulkPriceUpdate}
        onUpdateTags={handleBulkTagsUpdate}
        onUpdateCategories={handleBulkCategoriesUpdate}
        onDelete={handleBulkDelete}
        onClearSelection={() => setSelectedProducts([])}
      />

      <ProductDataTable
        columns={columns}
        data={products}
        onRowSelectionChange={setSelectedProducts}
      />
    </div>
  );
}
