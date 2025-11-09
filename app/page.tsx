import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Layers, Zap } from "lucide-react";
import { hasEnvVars } from "@/utils/utils";

export default function Home() {
  
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Epok Panel</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">
              Epok Panel
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Streamline your Squarespace shop management with powerful bulk editing,
              template-based product creation, and intuitive workflows.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/protected">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4">
            <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
              <Package className="h-12 w-12" />
              <h3 className="font-semibold text-lg">Product Management</h3>
              <p className="text-sm text-muted-foreground text-center">
                Manage your Squarespace products with an intuitive interface that's
                faster than the native dashboard.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
              <Layers className="h-12 w-12" />
              <h3 className="font-semibold text-lg">Template-Based Creation</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create products from templates (paintings, sculptures) with
                auto-configured categories, tags, and stock.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
              <Zap className="h-12 w-12" />
              <h3 className="font-semibold text-lg">Bulk Operations</h3>
              <p className="text-sm text-muted-foreground text-center">
                Edit multiple products simultaneously to save time and streamline
                your workflow.
              </p>
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p className="text-muted-foreground">
            © 2025 Epok Panel. All rights reserved.
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
