import Link from "next/link";
import { Home, Package } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Logo href="/" />
      <p className="mt-10 text-xs font-medium tracking-wider text-primary uppercase">
        404
      </p>
      <h1 className="heading-display mt-2 text-3xl text-foreground sm:text-4xl">
        That page is not on the yard.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The listing, proforma, or page you asked for may have been archived or
        the link is wrong.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/buyer" className={cn(buttonVariants(), "font-semibold")}>
          <Package className="size-4" />
          Browse materials
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          <Home className="size-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
