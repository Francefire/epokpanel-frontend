import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSquarespaceClient } from "@/utils/squarespace/get-client";
import { createClient } from "@/utils/supabase/server";
import { AlertCircle, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from 'next-intl/server';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const t = await getTranslations();
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
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.cards.totalProducts.title')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && totalProducts !== null ? totalProducts : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? t('dashboard.cards.totalProducts.notConnected')
                : apiStatus === "error"
                ? t('dashboard.cards.totalProducts.apiError')
                : t('dashboard.cards.totalProducts.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.cards.activeItems.title')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && activeItems !== null ? activeItems : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? t('dashboard.cards.activeItems.notConnected')
                : apiStatus === "error"
                ? t('dashboard.cards.activeItems.apiError')
                : t('dashboard.cards.activeItems.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.cards.recentUpdates.title')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected" && recentUpdates !== null ? recentUpdates : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "not_connected"
                ? t('dashboard.cards.recentUpdates.notConnected')
                : apiStatus === "error"
                ? t('dashboard.cards.recentUpdates.apiError')
                : t('dashboard.cards.recentUpdates.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.cards.apiStatus.title')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiStatus === "connected"
                ? t('dashboard.cards.apiStatus.connected')
                : apiStatus === "not_connected"
                ? t('dashboard.cards.apiStatus.notConnected')
                : t('dashboard.cards.apiStatus.error')}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiStatus === "connected"
                ? t('dashboard.cards.apiStatus.connectedDesc')
                : apiStatus === "not_connected"
                ? t('dashboard.cards.apiStatus.notConnectedDesc')
                : t('dashboard.cards.apiStatus.errorDesc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
