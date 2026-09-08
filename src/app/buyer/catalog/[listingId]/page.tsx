// =============================================================================
// ConMart — Listing Detail Page (Server Component)
// =============================================================================
// Fetches listing data and supplier yard inventory, delegating rendering to
// the bilingual ListingDetailView client component.
// =============================================================================

import { notFound } from "next/navigation";
import { fetchListingDetail, fetchDepotListings } from "@/lib/data/catalog";
import { getPlatformFeePercent, getVatRatePercent } from "@/lib/config/env";
import { ListingDetailView } from "./listing-detail-view";

interface ListingDetailPageProps {
  params: Promise<{ listingId: string }>;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { listingId } = await params;
  const listing = await fetchListingDetail(listingId);

  if (!listing || !listing.active) {
    notFound();
  }

  // Fetch other active materials from this same depot/supplier
  const depotListings = await fetchDepotListings(listing.seller.id, listing.id);
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE ?? "+251 91 100 0000";

  return (
    <ListingDetailView
      listing={listing}
      depotListings={depotListings}
      adminPhone={adminPhone}
      // Passed down so the buyer's live calculator uses the same rates the
      // server will apply. Fee and VAT are server-only configuration and are
      // undefined if a client component reads process.env directly.
      platformFeePercent={getPlatformFeePercent()}
      vatRatePercent={getVatRatePercent()}
    />
  );
}
