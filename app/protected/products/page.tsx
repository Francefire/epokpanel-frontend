import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/utils/squarespace/client";
import { getSquarespaceClient } from "@/utils/squarespace/get-client";
import { createClient } from "@/utils/supabase/server";
import { Edit3, Eye, EyeOff, Package, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

function formatPrice(value: string, currency: string = 'USD'): string {
  const amount = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const mainVariant = product.variants[0];
  const mainImage = product.images[0];
  const hasMultipleVariants = product.variants.length > 1;
  
  const price = mainVariant?.pricing.onSale && mainVariant.pricing.salePrice
    ? formatPrice(mainVariant.pricing.salePrice.value, mainVariant.pricing.salePrice.currency)
    : mainVariant?.pricing.basePrice
    ? formatPrice(mainVariant.pricing.basePrice.value, mainVariant.pricing.basePrice.currency)
    : 'N/A';

  const originalPrice = mainVariant?.pricing.onSale && mainVariant.pricing.basePrice
    ? formatPrice(mainVariant.pricing.basePrice.value, mainVariant.pricing.basePrice.currency)
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-muted">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.altText || product.name}
            className="object-cover w-full h-full"
            width={512}
            height={512}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {product.isVisible ? (
            <Badge variant="default" className="bg-green-500">
              <Eye className="h-3 w-3 mr-1" />
              Visible
            </Badge>
          ) : (
            <Badge variant="secondary">
              <EyeOff className="h-3 w-3 mr-1" />
              Hidden
            </Badge>
          )}
          {mainVariant?.pricing.onSale && (
            <Badge variant="destructive">Sale</Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <Badge variant="outline">{product.type}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description ? stripHtml(product.description) : 'No description'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {hasMultipleVariants ? `${product.variants.length} variants` : '1 variant'}
            </span>
            {mainVariant?.stock && !mainVariant.stock.unlimited && (
              <span className="text-muted-foreground">
                Stock: {mainVariant.stock.quantity}
              </span>
            )}
            {mainVariant?.stock?.unlimited && (
              <span className="text-muted-foreground">Unlimited stock</span>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={product.url} target="_blank" rel="noopener noreferrer">
                View Store
              </a>
            </Button>
            <Button size="sm" className="flex-1">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ProductsPage() {
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
    apiError = err instanceof Error ? err.message : 'Failed to fetch products';
    console.error('Error fetching products:', err);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage your Squarespace products and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/protected/products/bulk-edit">
              <Edit3 className="h-4 w-4 mr-2" />
              Bulk Edit
            </Link>
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {apiError ? (
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
              <Button variant="outline" asChild>
                <Link href="/protected/settings">Go to Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              Your Squarespace store doesn&apos;t have any products yet, or they haven&apos;t synced.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                No products to display. Add products to your Squarespace store to get started.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/protected/settings">Check API Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

