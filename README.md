# ConMart

B2B marketplace for construction materials in Ethiopia. Contractors post what
they need; verified suppliers pay a small fee to be introduced to them.

ConMart does not take a cut of the trade and does not process payment for
materials. It sells introductions. A supplier tops up a prepaid wallet, and
accepting a buyer's enquiry debits a category-based unlock fee and reveals each
party's contact details to the other. Everything up to that moment is masked.

The interface is bilingual (English and Amharic) and prices are in Ethiopian
Birr.

---

## Quick start

Requires Node.js 20 or later and a PostgreSQL database (Supabase in practice,
for its bundled auth and storage).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:push              # create the schema
npm run db:seed              # optional: demo suppliers, listings, categories
npm run dev
```

The app runs at http://localhost:3000.

Every variable in `.env.example` is documented there. `src/lib/config/env.ts`
validates them at startup, so a missing value fails immediately with a message
naming the variable rather than surfacing later as a broken page.

### Creating the first administrator

The registration form only offers buyer and supplier. `ADMIN` and
`FIELD_AGENT` are granted from the command line, because a public form that
mints privileged accounts is equivalent to having no access control:

```bash
# Register through /register first, then promote the account
npx tsx scripts/grant-role.ts you@example.com ADMIN
```

This needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` to resolve the account
by email.

---

## How the business logic works

**Categories carry the price.** Each material category has an `unlockFee`. A
cement introduction and a rebar introduction cost the supplier different
amounts, set by an administrator in the command center.

**The wallet has two balances.** `cashBalance` is topped up by the supplier and
is withdrawable. `creditBalance` is issued by ConMart as a goodwill refund and
is not. An unlock fee spends credit first — see
[`src/lib/wallet/accounting.ts`](src/lib/wallet/accounting.ts) for why.

**Top-ups are settled by hand.** Ethiopian payment rails available to the
platform have no server-to-server callback, so a supplier submits a Telebirr or
bank reference and an administrator matches it against the statement before the
balance moves. This is a deliberate constraint, not an unfinished integration.

**A failed deal is refunded as credit.** If a supplier reports that a deal
collapsed after the introduction, `DEAL_FAILURE_REFUND_PERCENT` of the fee
returns as non-withdrawable credit. Suppliers who keep failing past a threshold
are suspended automatically.

**Disputes are mediated.** Either party can open a case against an unlocked
introduction; an administrator resolves it and decides whether credit is
returned.

---

## Architecture

```
src/
  app/
    (auth)/          login and registration
    buyer/           catalog, enquiries, orders
    seller/          listings, wallet, enquiries
    admin/           command center: sellers, categories, top-ups, disputes
    dashboard/       role router — resolves the caller's landing page
    actions/         server actions, one module per domain
    api/upload/      product image upload
  lib/
    auth/session.ts  the single source of authorization truth
    config/env.ts    validated environment
    security/        contact masking, rate limiting
    wallet/          wallet service and accounting rules
    engine/          proforma pricing, reference codes
    data/            read-side query modules
  proxy.ts           session refresh, auth gate, security headers
prisma/schema.prisma
```

Longer discussion of the boundaries, and the known trade-offs, in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

### Authorization

One rule: **roles come from the `users` table, never from the JWT.**

Supabase keeps sign-up metadata in `user_metadata`, which the account holder can
write. A role claim read from there is a role claim the user chose for
themselves. So `src/proxy.ts` only answers "is this request authenticated?",
and every role decision goes through `requireRole` (layouts and pages) or
`authorize` (server actions) in
[`src/lib/auth/session.ts`](src/lib/auth/session.ts), which reads the database.

Server actions are public HTTP endpoints. Each one re-derives the caller and
checks that they are a party to the record they are acting on — being able to
render a button is not authorization to press it.

### Contact masking

The product being sold is the introduction, so leaking a phone number is
leaking revenue. Masking happens on the server before serialization, in
[`src/lib/security/masking.ts`](src/lib/security/masking.ts) — hiding a field in
the UI still ships it in the RSC payload.

Masked before unlock: supplier legal name, both phone numbers, and the
street-level depot address, which is generalized to a city so buyers can still
judge freight distance. Free-text fields are scrubbed of numbers, emails, and
messaging handles, because "call me on 09…" in a delivery address is a free
introduction.

---

## Development

```bash
npm run dev              # dev server
npm run verify           # typecheck + lint + tests, same as CI
npm test                 # unit tests
npm run test:watch
npm run test:coverage
npm run db:studio        # browse the database
```

Tests cover the modules where a regression costs money or gives away the
product: currency rounding, proforma arithmetic, wallet accounting, contact
masking, reference codes, and input validation. These are held to a 95% line
coverage threshold, configured in `vitest.config.ts`.

`scripts/headless-audit.mjs` is a separate end-to-end smoke check that needs a
running server and a seeded database; it is not part of `npm run verify`.

---

## Deployment

Deploys to Vercel as a standard Next.js app.

1. Set every variable from `.env.example` in the project's environment
   settings. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are
   required: without them rate limits are counted per serverless instance and
   cannot enforce a global budget.
2. Point `DATABASE_POOLER_URL` at the transaction pooler (port 6543).
   Serverless functions open far more short-lived connections than Postgres
   holds open directly.
3. Run `npm run db:push` against production once.
4. Create the `products` storage bucket with public read access.
5. Promote your first administrator with `scripts/grant-role.ts`.

Co-locate the Vercel region with the database region. The wallet debit path is
several round-trips inside one transaction, and cross-region latency is charged
on each.

Before going live, read [`SECURITY.md`](SECURITY.md) — in particular the note
on rotating any credential that has ever been committed.
