import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSquarespaceClient } from "@/utils/squarespace/get-client";
import { BulkEditClient } from "./bulk-edit-client";
import { Toaster } from "@/components/ui/sonner";
import type { Product } from "@/utils/squarespace/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BulkEditPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch products from Squarespace
  let products: Product[] = [];
  let apiError: string | null = null;

  try {
    const client = await getSquarespaceClient();
    const response = await client.products.list();
    products = response.products;
  } catch (err) {
    apiError = err instanceof Error ? err.message : "Failed to fetch products";
    console.error("Error fetching products:", err);
  }

  if (apiError) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Products</CardTitle>
            <CardDescription>{apiError}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Please check your Squarespace API configuration in settings.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/protected/settings">Go to Settings</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/protected/products">Back to Products</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              Your Squarespace store doesn't have any products to edit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/protected/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <BulkEditClient initialProducts={products} />
      <Toaster />
    </>
  );
}
