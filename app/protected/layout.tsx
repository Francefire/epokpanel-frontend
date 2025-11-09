import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/utils";
import Link from "next/link";
import { Package, Settings, LayoutGrid } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-8 items-center">
              <Link href="/" className="font-semibold text-lg">
                Epok Panel
              </Link>
              <div className="hidden md:flex gap-6 items-center">
                <Link 
                  href="/protected" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/protected/products" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link 
                  href="/protected/settings" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 w-full max-w-7xl p-5">
          {children}
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
