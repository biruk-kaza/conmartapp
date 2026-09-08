// =============================================================================
// ConMart — Seller Layout (Responsive & Localized)
// =============================================================================

import { HardHat, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { requireRole } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import {
  SellerSidebarNav,
  SellerBottomNav,
  SellerSignOutButton,
} from "./seller-nav";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["SELLER", "ADMIN"], "/seller/dashboard");
  const userName = user.name;

  return (
    <div className="flex min-h-screen flex-col md:flex-row w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <HardHat className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">ConMart</span>
              <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                Seller
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        <Separator />

        <SellerSidebarNav />

        <Separator />

        <div className="p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">
            <span className="block font-medium text-foreground">{userName}</span>
            <span className="block truncate">{user.email}</span>
          </div>
          <SellerSignOutButton />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-3 sm:px-4 md:hidden w-full max-w-full overflow-x-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
            <HardHat className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight truncate">ConMart</span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase shrink-0">Seller</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="max-w-[80px] truncate">{userName}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden bg-background pb-16 md:pb-0">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8 w-full max-w-full overflow-x-hidden">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <SellerBottomNav />
    </div>
  );
}
