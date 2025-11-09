import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsForm } from "@/components/settings-form";
import { getApiKeys } from "@/utils/api-keys";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch existing API keys if any
  const { squareSpaceConfig } = await getApiKeys();
  

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Squarespace API and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Squarespace API Configuration</CardTitle>
          <CardDescription>
            Connect your Squarespace store to enable product management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm 
            initialApiKey={squareSpaceConfig?.apiKey || undefined} 
            initialStoreUrl={squareSpaceConfig?.storeUrl || undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Templates</CardTitle>
          <CardDescription>
            Configure default settings for product templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Painting Template</h4>
              <p className="text-sm text-muted-foreground">
                Default categories: Art, Paintings | Stock: 1 | Tags: artwork, painting
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Sculpture Template</h4>
              <p className="text-sm text-muted-foreground">
                Default categories: Art, Sculptures | Stock: 1 | Tags: artwork, sculpture
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
