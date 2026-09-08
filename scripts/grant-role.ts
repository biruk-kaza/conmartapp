// =============================================================================
// ConMart — Role Grant CLI
// =============================================================================
// ADMIN and FIELD_AGENT cannot be chosen at sign-up, because a public form
// that mints privileged accounts is the same thing as no access control. They
// are granted here instead, by someone with database credentials.
//
// Usage:
//   npx tsx scripts/grant-role.ts <email> <BUYER|SELLER|ADMIN|FIELD_AGENT>
//
// The account must already exist: register normally through the web form
// first, then promote it.
// =============================================================================

import dotenv from "dotenv";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const VALID_ROLES = Object.values(UserRole);

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

async function main(): Promise<void> {
  const [email, requestedRole] = process.argv.slice(2);

  if (!email || !requestedRole) {
    fail(
      "Usage: npx tsx scripts/grant-role.ts <email> <role>\n" +
        `  Roles: ${VALID_ROLES.join(", ")}`
    );
  }

  if (!VALID_ROLES.includes(requestedRole as UserRole)) {
    fail(`"${requestedRole}" is not a role. Choose one of: ${VALID_ROLES.join(", ")}`);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!databaseUrl) {
    fail("DATABASE_URL is not set. Copy .env.example to .env.local first.");
  }

  if (!supabaseUrl || !serviceRoleKey) {
    fail(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to " +
        "look up an account by email. Find the service role key under " +
        "Project Settings > API in the Supabase dashboard."
    );
  }

  // Email lives in Supabase Auth, not in the `users` table, so the auth ID has
  // to be resolved through the admin API before the role can be updated.
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  if (error) {
    fail(`Could not query Supabase Auth: ${error.message}`);
  }

  const authUser = data.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );

  if (!authUser) {
    fail(
      `No Supabase Auth account found for ${email}. Register through /register first, ` +
        "then run this script to promote the account."
    );
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

  try {
    const existing = await prisma.user.findUnique({
      where: { authId: authUser.id },
      select: { id: true, role: true, name: true },
    });

    if (!existing) {
      fail(
        `${email} has an auth account but no ConMart profile. Sign in once to ` +
          "complete registration, then re-run this script."
      );
    }

    if (existing.role === requestedRole) {
      console.log(`\n  ${email} is already ${requestedRole}. Nothing to do.\n`);
      return;
    }

    await prisma.user.update({
      where: { id: existing.id },
      data: { role: requestedRole as UserRole },
    });

    console.log(
      `\n  ${existing.name} <${email}>: ${existing.role} -> ${requestedRole}\n` +
        "  The change takes effect on their next request; roles are read from the\n" +
        "  database on every authorization check, so no re-login is needed.\n"
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
