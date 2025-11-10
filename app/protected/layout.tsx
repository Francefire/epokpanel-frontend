import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { hasEnvVars } from "@/utils/utils";
import Link from "next/link";
import { Package, Settings, LayoutGrid } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations();
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-8 items-center">
              <Link href="/" className="font-semibold text-lg">
                {t('common.epokPanel')}
              </Link>
              <div className="hidden md:flex gap-6 items-center">
                <Link 
                  href="/protected" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutGrid className="h-4 w-4" />
                  {t('nav.dashboard')}
                </Link>
                <Link 
                  href="/protected/products" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Package className="h-4 w-4" />
                  {t('nav.products')}
                </Link>
                <Link 
                  href="/protected/settings" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
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
            {t('common.copyright')}
          </p>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </footer>
      </div>
    </main>
  );
}
