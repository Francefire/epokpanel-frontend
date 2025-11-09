import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSquarespaceClient } from "@/utils/squarespace/get-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Squarespace data
  let totalProducts = null;
  let activeItems = null;
  let recentUpdates = null;
  let apiStatus: "connected" | "not_connected" | "error" = "not_connected";

  try {
    const sqClient = await getSquarespaceClient();
    const products = await sqClient.products.listAll();
    totalProducts = products.length;
    activeItems = products.filter(p => p.variants.some(v => v.stock && v.stock.quantity > 0)).length;
    // Recent updates: products updated in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    recentUpdates = products.filter(p => {
      // If product has a "updatedAt" or "modifiedAt" field, use it. Otherwise, fallback to none.
      // @ts-ignore
      const updated = p.updatedAt || p.modifiedAt || null;
      return updated && new Date(updated) > sevenDaysAgo;
    }).length;
    apiStatus = "connected";
  } catch (e) {
    apiStatus = (e instanceof Error && e.message.includes("configuration")) ? "not_connected" : "error";
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Epok Panel dashboard. Manage your Squarespace products efficiently.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && totalProducts !== null ? totalProducts : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? "Connect Squarespace to view"
                : apiStatus === "error"
                ? "API error"
                : "Total products in store"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && activeItems !== null ? activeItems : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? "Connect Squarespace to view"
                : apiStatus === "error"
                ? "API error"
                : "In stock products"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && recentUpdates !== null ? recentUpdates : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? "Connect Squarespace to view"
                : apiStatus === "error"
                ? "API error"
                : "Last 7 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected"
                ? "Connected"
                : apiStatus === "not_connected"
                ? "Not Connected"
                : "Error"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "connected"
                ? "Squarespace API connected"
                : apiStatus === "not_connected"
                ? "Configure API credentials"
                : "API error"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
