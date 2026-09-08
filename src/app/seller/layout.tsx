import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";
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

  return (
    <AppShell
      portal="Seller"
      userName={user.name}
      userEmail={user.email ?? ""}
      sidebarNav={<SellerSidebarNav />}
      sidebarFooter={<SellerSignOutButton />}
      mobileNav={<SellerBottomNav />}
    >
      {children}
    </AppShell>
  );
}
