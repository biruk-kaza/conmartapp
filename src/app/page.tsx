"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { t, locale } = useLanguage();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 cm-glow" />
          <div className="pointer-events-none absolute inset-0 cm-grid opacity-60" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                {t("hero_badge")}
              </p>

              <h1 className="heading-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
                {t("hero_title_1")}{" "}
                <span className="text-primary">{t("hero_title_highlight")}</span>{" "}
                {t("hero_title_2")}
              </h1>

              <p className="mt-5 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
                {t("hero_description")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/buyer"
                  className={cn(buttonVariants({ size: "lg" }), "font-semibold")}
                >
                  {t("hero_btn_start_buying")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "font-semibold"
                  )}
                >
                  {t("hero_btn_list_materials")}
                </Link>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/70 pt-6">
                <div>
                  <dt className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                    {locale === "am" ? "ሞዴል" : "Model"}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {locale === "am" ? "ቀጥታ መግቢያ" : "Direct introduction"}
                  </dd>
                </div>
                <div>
                  <dt className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                    {locale === "am" ? "ጥበቃ" : "Protection"}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">80%</dd>
                </div>
                <div>
                  <dt className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                    {locale === "am" ? "ገበያ" : "Market"}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    Addis Ababa
                  </dd>
                </div>
              </dl>
            </div>

            <HeroPreview locale={locale} />
          </div>
        </section>

        <section className="border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-px px-4 sm:grid-cols-3 sm:px-6">
            <Feature
              icon={ShoppingCart}
              title={t("feature_transparent_title")}
              description={t("feature_transparent_desc")}
            />
            <Feature
              icon={Building2}
              title={t("feature_proforma_title")}
              description={t("feature_proforma_desc")}
            />
            <Feature
              icon={ShieldCheck}
              title={t("feature_managed_title")}
              description={t("feature_managed_desc")}
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-center text-xs font-medium tracking-wide text-primary uppercase">
            {t("how_it_works_title")}
          </p>
          <h2 className="heading-display mx-auto mt-2 max-w-xl text-center text-3xl text-foreground">
            {locale === "am"
              ? "ከጥያቄ እስከ የተረጋገጠ አቅራቢ — በሦስት እርምጃ"
              : "From a purchase request to a verified depot — in three steps"}
          </h2>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            <Step n="01" title={t("step_1_title")} description={t("step_1_desc")} />
            <Step n="02" title={t("step_2_title")} description={t("step_2_desc")} />
            <Step n="03" title={t("step_3_title")} description={t("step_3_desc")} />
          </ol>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShoppingCart;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 bg-background/40 px-1 py-8 sm:px-6">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  description,
}: {
  n: string;
  title: string;
  description: string;
}) {
  return (
    <li className="relative rounded-2xl border border-border bg-card p-6">
      <span className="font-mono text-xs font-semibold tracking-widest text-primary">
        {n}
      </span>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </li>
  );
}

function HeroPreview({ locale }: { locale: string }) {
  const rows = [
    { name: "Dangote OPC 42.5", loc: "Kaliti", price: "1,280" },
    { name: "Zuquala Rebar Ø16", loc: "Akaki", price: "118,400" },
    { name: "Mojo River Sand", loc: "Mojo", price: "2,450" },
  ];

  return (
    <div className="relative">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between px-1">
          <p className="text-xs font-semibold text-foreground">
            {locale === "am" ? "የቀጥታ የጅምላ ዋጋ" : "Live wholesale offers"}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-2xs font-medium text-success">
            <Lock className="size-3" />
            {locale === "am" ? "አድራሻ ተሸፍኗል" : "Contact masked"}
          </span>
        </div>
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-3.5 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{row.name}</p>
                <p className="text-2xs text-muted-foreground">{row.loc}</p>
              </div>
              <p className="tabular text-sm font-semibold text-foreground">
                {row.price}
                <span className="ml-1 text-2xs font-normal text-muted-foreground">
                  ETB
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 px-1 text-2xs text-muted-foreground">
          {locale === "am"
            ? "ዋጋዎች የሚያመለክቱ ናቸው። አድራሻ የሚከፈተው አቅራቢው መግቢያ ክፍያ ሲከፍል ብቻ ነው።"
            : "Prices are indicative. Contact details unlock only after the supplier pays the introduction fee."}
        </p>
      </div>
    </div>
  );
}
