"use client";

import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Command,
  FileText,
  MessageSquare,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import dynamic from "next/dynamic";

import {
  benefits,
  businessTags,
  EARLY_ACCESS_NOTE,
  featureCards,
  liveFeatures,
  partnerFeatures,
  PLANNED_PRO_PRICE,
  PLANNED_PRO_PRICE_NOTE,
  plannedFeatures,
} from "@/lib/landing-content";

import { EarlyAccessCtaButton, EarlyAccessCtaProvider } from "./early-access-cta";
import { EarlyAccessForm } from "./early-access-form";
import { FloatCard, Reveal } from "./landing-motion";
import { LandingNav } from "./landing-nav";
import { LandingPageShell } from "./landing-page-shell";
import { QuoteraLogo } from "@/components/brand/quotera-logo";
import {
  Eyebrow,
  FigmaButton,
  FigmaCard,
  FigmaCheck,
  FloatingChip,
  SectionSubtitle,
  SectionTitle,
} from "./landing-ui";

const FaqSection = dynamic(
  () => import("./faq-section").then((mod) => mod.FaqSection),
  { ssr: true },
);

const partnerIcons = {
  activity: Activity,
  chart: PieChart,
  command: Command,
} as const;

const stats = [
  { label: "GST-ready", value: "CGST · SGST · IGST" },
  { label: "Setup time", value: "Under 5 min" },
  { label: "Share docs", value: "PDF + WhatsApp" },
  { label: "Your brand", value: "100% on docs" },
] as const;

function DashboardHero() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="quotera-glow pointer-events-none absolute -right-10 top-0 size-56 rounded-full bg-[var(--qt-brand)]/20 blur-3xl" />
      <div
        className="quotera-glow pointer-events-none absolute -left-8 bottom-10 size-44 rounded-full bg-[var(--qt-accent)]/15 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <FloatCard className="absolute -left-3 top-14 z-20 hidden sm:block">
        <FloatingChip>
          <p className="text-[12px] text-[var(--qt-muted)]">Enter amount</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-[16px] font-medium text-[var(--qt-ink)]">₹12,500</p>
            <span className="rounded-[40px] bg-[var(--qt-accent)] px-3 py-1 text-[13px] font-semibold text-[var(--qt-brand)]">
              Send
            </span>
          </div>
        </FloatingChip>
      </FloatCard>

      <div className="relative overflow-hidden rounded-[20px] border border-[var(--qt-brand)]/10 bg-[var(--qt-card)] shadow-[0_24px_60px_rgb(var(--qt-brand-rgb)/0.15)]">
        <div className="border-b border-[var(--qt-brand)]/8 bg-[var(--qt-cream-light)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-[var(--qt-ink)]">Dashboard</p>
              <p className="text-[12px] text-[var(--qt-muted)]">Welcome back 👋</p>
            </div>
            <span className="rounded-full bg-[var(--qt-brand)]/15 px-3 py-1 text-[11px] font-semibold text-[var(--qt-brand-text)]">
              Preview
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {[
            { label: "Revenue", value: "₹12.5L", icon: TrendingUp },
            { label: "Clients", value: "156", icon: Users },
            { label: "Pending", value: "18", icon: FileText },
            { label: "This month", value: "₹2.8L", icon: BarChart3 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[10px] border border-[var(--qt-brand)]/8 bg-[var(--qt-card)] p-3 transition-colors hover:border-[var(--qt-brand)]/25 hover:bg-[var(--qt-cream-light)]"
            >
              <div className="mb-2 flex size-8 items-center justify-center rounded-[8px] bg-[var(--qt-accent)]/20 text-[var(--qt-brand)]">
                <item.icon className="size-4" />
              </div>
              <p className="text-[18px] font-semibold text-[var(--qt-ink)]">{item.value}</p>
              <p className="text-[11px] text-[var(--qt-muted)]">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--qt-brand)]/8 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--qt-muted)]">
            Recent activity
          </p>
          <div className="space-y-2">
            {[
              { name: "TechCorp Solutions", status: "Paid", tone: "green" },
              { name: "Design Studio", status: "Pending", tone: "amber" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[8px] bg-[var(--qt-cream-light)] px-3 py-2"
              >
              <span className="text-[13px] font-medium text-[var(--qt-ink)]">{row.name}</span>
              <span
                className={
                  row.tone === "green"
                    ? "rounded-full bg-[var(--qt-brand)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--qt-brand)]"
                    : "rounded-full bg-[var(--qt-accent)]/25 px-2 py-0.5 text-[10px] font-semibold text-[var(--qt-brand)]"
                }
              >
                {row.status}
              </span>
            </div>
          ))}
          </div>
        </div>
      </div>

      <FloatCard delay={800} className="absolute -right-2 top-6 z-20 hidden sm:block">
        <FloatingChip>
          <p className="text-[12px] text-[var(--qt-muted)]">Total revenue</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-[16px] font-medium text-[var(--qt-ink)]">₹2.8L</p>
            <TrendingUp className="size-4 text-[var(--qt-brand)]" />
          </div>
        </FloatingChip>
      </FloatCard>

      <FloatCard delay={400} className="absolute -bottom-3 left-6 z-20 hidden sm:block">
        <div className="rounded-[10px] bg-[var(--qt-brand-dark)] px-4 py-3 shadow-[0_12px_32px_rgb(var(--qt-brand-rgb) /0.35)]">
          <p className="text-[12px] text-[var(--qt-cream)]/70">WhatsApp sent</p>
          <p className="mt-1 text-[14px] font-medium text-[var(--qt-cream)]">Invoice shared ✓</p>
        </div>
      </FloatCard>

      <div className="absolute bottom-20 -right-2 z-10 hidden size-10 rotate-12 items-center justify-center rounded-[10px] bg-[var(--qt-accent)] shadow-[0_8px_20px_rgb(var(--qt-accent-rgb)/0.4)] sm:flex">
        <MessageSquare className="size-5 text-[var(--qt-brand)]" />
      </div>
      <div className="absolute right-10 top-28 z-10 hidden size-11 -rotate-6 items-center justify-center rounded-[10px] bg-[var(--qt-brand-light)] shadow-[0_8px_20px_rgb(var(--qt-brand-rgb)/0.3)] sm:flex">
        <Sparkles className="size-5 text-[var(--qt-cream)]" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="quotera-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[var(--qt-brand)]/12 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-[555px]">
          <div className="quotera-enter">
            <Eyebrow>Early access · India</Eyebrow>
          </div>

          <h1 className="quotera-enter quotera-enter-1 mt-6 font-[family-name:var(--font-outfit)] text-[40px] font-bold leading-[1.08] tracking-tight text-[var(--qt-ink)] sm:text-[56px] lg:text-[68px] lg:leading-[1.05]">
            Clients to payment,{" "}
            <span className="text-[var(--qt-brand)]">one place</span>
          </h1>

          <div className="quotera-enter quotera-enter-2 mt-8 h-[3px] w-full max-w-[479px] rounded-full bg-gradient-to-r from-[var(--qt-accent)] via-[var(--qt-brand)] to-transparent" />

          <p className="quotera-enter quotera-enter-2 mt-8 max-w-[461px] text-[16px] font-medium leading-[30px] text-[var(--qt-ink)] sm:text-[18px]">
            Quotations, GST invoices, payment tracking, and branded PDFs — for
            Indian freelancers and small businesses. Not accounting software; a
            focused tool for client documents and collections.
          </p>

          <div className="quotera-enter quotera-enter-3 mt-10">
            <EarlyAccessCtaButton showArrow>Apply for early access</EarlyAccessCtaButton>
          </div>

          <p className="quotera-enter quotera-enter-4 mt-6 max-w-[461px] text-[14px] font-medium leading-relaxed text-[var(--qt-muted)]">
            {EARLY_ACCESS_NOTE}
          </p>
        </div>

        <div className="quotera-enter quotera-enter-2">
          <DashboardHero />
          <p className="mt-3 text-center text-[12px] text-[var(--qt-muted)] lg:text-left">
            Product preview — sample figures for layout only
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-[1180px] gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {stats.map((item, i) => (
          <Reveal key={item.label} delay={i * 60}>
            <div className="flex h-full min-h-[88px] flex-col items-center justify-center rounded-[16px] border border-[var(--qt-brand)]/10 bg-[var(--qt-card)] px-4 py-4 text-center shadow-[0_4px_16px_rgb(var(--qt-brand-rgb) /0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--qt-accent)]/40 hover:shadow-[0_12px_28px_rgb(var(--qt-brand-rgb)/0.12)]">
              <p className="font-[family-name:var(--font-outfit)] text-[22px] font-bold text-[var(--qt-brand)] sm:text-[24px]">{item.label}</p>
              <p className="mt-1 text-[13px] font-medium text-[var(--qt-muted)] sm:text-[14px]">
                {item.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TagsSection() {
  const tags = [...businessTags, ...businessTags];

  return (
    <section className="overflow-hidden border-y border-[var(--qt-brand)]/10 bg-[var(--qt-cream-light)] py-10">
      <Reveal className="mx-auto max-w-[1180px] px-4 text-center sm:px-8">
        <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[var(--qt-muted)]">
          Built for Indian businesses
        </p>
      </Reveal>
      <div className="relative mt-6 overflow-hidden">
        <div className="quotera-marquee flex w-max gap-12 px-4">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="whitespace-nowrap font-[family-name:var(--font-outfit)] text-[22px] font-semibold text-[var(--qt-brand)]/25 transition-colors hover:text-[var(--qt-brand)] sm:text-[26px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="bg-[var(--qt-surface)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="left">
          <Eyebrow>Workflow</Eyebrow>
          <SectionTitle className="mt-4">
            How Quotera supports your daily workflow
          </SectionTitle>
          <SectionSubtitle className="mt-6 max-w-[644px]">
            From first quotation to final payment — one platform for clients,
            documents, and business visibility. No spreadsheet patchwork, no
            WhatsApp chaos.
          </SectionSubtitle>
          <div className="mt-10 inline-flex items-center gap-3 rounded-[10px] border border-[var(--qt-brand)]/12 bg-[var(--qt-card)] px-4 py-3 shadow-[0_4px_16px_rgb(var(--qt-brand-rgb) /0.06)]">
            <span className="flex size-2 animate-pulse rounded-full bg-[var(--qt-accent)]" />
            <p className="text-[16px] font-medium text-[var(--qt-ink)]">
              Product is live — we&apos;re improving it with early users
            </p>
          </div>
        </Reveal>

        <div className="space-y-5">
          {partnerFeatures.map((item, i) => {
            const Icon = partnerIcons[item.icon];
            return (
              <Reveal key={item.title} delay={i * 90} direction="right">
                <div className="group flex gap-5 rounded-[16px] border border-transparent bg-[var(--qt-card)]/80 p-4 transition-all duration-300 hover:border-[var(--qt-brand)]/15 hover:bg-[var(--qt-card)] hover:shadow-[0_12px_28px_rgb(var(--qt-brand-rgb)/0.08)]">
                  <div className="flex size-[60px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--qt-accent)]/15 shadow-[0_4px_12px_rgb(var(--qt-brand-rgb) /0.06)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-7 text-[var(--qt-brand)]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-outfit)] text-[22px] font-bold text-[var(--qt-ink)] sm:text-[28px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[428px] text-[16px] font-medium leading-[28px] text-[var(--qt-muted)] sm:text-[18px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturePreview({ variant }: { variant: "collab" | "storage" | "analytics" }) {
  const previewShell =
    "flex h-[220px] items-center justify-center border-b border-[var(--qt-brand)]/10 bg-[var(--qt-cream-light)] p-6";

  if (variant === "collab") {
    return (
      <div className={previewShell}>
        <div className="flex -space-x-3">
          {["RP", "PS", "AK"].map((initial, i) => (
            <div
              key={initial}
              className="flex size-14 items-center justify-center rounded-full border-4 border-[var(--qt-card)] text-sm font-bold text-[var(--qt-cream)] shadow-md"
              style={{ background: ["var(--qt-brand)", "var(--qt-brand-light)", "var(--qt-brand-light)"][i], zIndex: 3 - i }}
            >
              {initial}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "storage") {
    return (
      <div className={previewShell}>
        <div className="w-full max-w-[280px] rounded-[12px] border border-[var(--qt-brand)]/12 bg-[var(--qt-card)] p-4 shadow-[0_8px_20px_rgb(var(--qt-brand-rgb)/0.08)]">
          <p className="text-[12px] font-medium text-[var(--qt-muted)]">Document file</p>
          <p className="mt-2 text-[16px] font-semibold text-[var(--qt-ink)]">
            Invoice #INV-1042.pdf
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--qt-brand)]/10">
            <div className="h-full w-3/4 rounded-full bg-[var(--qt-brand)] transition-all duration-1000" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={previewShell}>
      <div className="relative flex size-32 items-center justify-center rounded-full border-[10px] border-[var(--qt-brand)]/15 bg-[var(--qt-card)]">
        <div className="absolute inset-3 rounded-full border-[10px] border-[var(--qt-brand)] border-r-transparent" />
        <span className="text-[22px] font-bold text-[var(--qt-brand)]">78%</span>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-[var(--qt-cream-light)]/40 py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow>Capabilities</Eyebrow>
          <SectionTitle className="mt-4">What&apos;s included today</SectionTitle>
          <SectionSubtitle className="mx-auto mt-4 max-w-2xl">
            These features are available now in the app — not a future roadmap
            slide.
          </SectionSubtitle>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featureCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <FigmaCard className="flex h-full flex-col overflow-hidden">
                <FeaturePreview variant={card.variant} />
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-[family-name:var(--font-outfit)] text-[24px] font-bold text-[var(--qt-ink)] sm:text-[28px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[16px] font-medium leading-[28px] text-[var(--qt-muted)] sm:text-[18px]">
                    {card.description}
                  </p>
                </div>
              </FigmaCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2">
        <Reveal direction="left">
          <Eyebrow>Benefits</Eyebrow>
          <SectionTitle className="mt-4">Why teams use Quotera</SectionTitle>
          <ul className="mt-10 space-y-5">
            {benefits.map((item) => (
              <FigmaCheck key={item}>{item}</FigmaCheck>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="right" delay={120} className="relative">
          <div className="overflow-hidden rounded-[20px] bg-[var(--qt-cream-light)] ring-1 ring-[var(--qt-brand)]/10">
            <Image
              src="/landing/hero-person.jpg"
              alt="Business owner using Quotera"
              width={450}
              height={529}
              sizes="(max-width: 1024px) 100vw, 540px"
              quality={80}
              loading="lazy"
              className="h-[360px] w-full object-cover object-[center_20%] sm:h-[500px]"
            />
          </div>
          <FloatCard className="absolute left-4 top-8 sm:left-8">
            <FloatingChip>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--qt-brand)]/15 text-sm font-bold text-[var(--qt-brand)]">
                  QT
                </div>
                <div>
                  <p className="text-[16px] font-medium text-[var(--qt-ink)]">Sample UI</p>
                  <p className="text-[12px] text-[var(--qt-muted)]">Illustration only</p>
                </div>
              </div>
            </FloatingChip>
          </FloatCard>
          <FloatCard delay={600} className="absolute bottom-8 left-8">
            <FloatingChip>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[var(--qt-brand)]" />
                <p className="text-[15px] font-medium text-[var(--qt-ink)]">Payment tracking</p>
              </div>
            </FloatingChip>
          </FloatCard>
          <FloatCard delay={300} className="absolute -right-2 top-1/3 hidden sm:block">
            <FloatingChip>
              <p className="text-[12px] text-[var(--qt-muted)]">Dashboard view</p>
              <p className="text-[16px] font-medium text-[var(--qt-ink)]">Revenue & dues</p>
            </FloatingChip>
          </FloatCard>
        </Reveal>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-[var(--qt-cream-light)] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <SectionTitle className="mt-4">Simple and honest</SectionTitle>
          <SectionSubtitle className="mx-auto mt-4 max-w-2xl">
            Use the full product free during early access. We&apos;ll introduce a
            paid plan later — early users get advance notice and better pricing.
          </SectionSubtitle>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[900px] gap-6 lg:grid-cols-2 lg:items-stretch">
          <Reveal delay={100}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[var(--qt-brand)] p-8 shadow-[0_24px_60px_rgb(var(--qt-brand-rgb)/0.35)]">
              <div className="absolute -bottom-24 -left-24 size-[320px] rounded-full bg-[var(--qt-accent)]/10" />
              <span className="relative inline-flex w-fit rounded-[10px] bg-[var(--qt-accent)] px-4 py-2 text-[14px] font-semibold text-[var(--qt-brand)]">
                Available now
              </span>
              <p className="relative mt-6 font-[family-name:var(--font-outfit)] text-[30px] font-semibold text-[var(--qt-cream)]">
                Early access
              </p>
              <p className="relative mt-4 text-[18px] font-medium leading-[27px] text-[var(--qt-cream)]/90">
                Everything listed on this page. No credit card.
              </p>
              <div className="relative mt-6 flex items-end gap-1 text-[var(--qt-cream)]">
                <span className="text-[18px] font-medium">₹</span>
                <span className="text-[50px] font-semibold leading-none">0</span>
              </div>
              <div className="relative mt-8 flex-1 rounded-[10px] bg-[var(--qt-card)] p-6">
                <ul className="space-y-3">
                  {liveFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[15px] font-medium text-[var(--qt-ink)]"
                    >
                      <span className="mt-0.5 text-[var(--qt-brand)]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <EarlyAccessCtaButton className="relative mt-8 w-full !py-4" showArrow>
                Apply for early access
              </EarlyAccessCtaButton>
            </div>
          </Reveal>

          <Reveal delay={0}>
            <FigmaCard className="flex h-full flex-col p-8">
              <span className="inline-flex w-fit rounded-[10px] border border-[var(--qt-brand)]/15 bg-[var(--qt-cream-light)] px-4 py-2 text-[14px] font-semibold text-[var(--qt-brand)]">
                After public launch
              </span>
              <p className="mt-6 text-[30px] font-semibold text-[var(--qt-ink)]">Pro</p>
              <p className="mt-4 text-[16px] font-medium leading-[27px] text-[var(--qt-muted)]">
                For solo owners and small teams who outgrow spreadsheets
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-[18px] font-medium text-[var(--qt-muted)]">₹</span>
                <span className="text-[50px] font-semibold leading-none text-[var(--qt-ink)]">
                  {PLANNED_PRO_PRICE.replace("₹", "")}
                </span>
                <span className="mb-2 text-[16px] text-[var(--qt-muted)]">/mo</span>
              </div>
              <p className="mt-2 text-[13px] text-[var(--qt-muted)]">{PLANNED_PRO_PRICE_NOTE}</p>
              <div className="mt-8 flex-1 rounded-[10px] bg-[var(--qt-cream)]/60 p-6">
                <p className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-[var(--qt-muted)]">
                  On the roadmap
                </p>
                <ul className="space-y-3 text-[16px] font-medium text-[var(--qt-ink)]">
                  {plannedFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 text-[var(--qt-muted)]">○</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <FigmaButton
                href="mailto:hello@quotera.in"
                variant="white"
                className="mt-8 w-full !py-4"
              >
                Questions? Email us
              </FigmaButton>
            </FigmaCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DarkCtaSection() {
  return (
    <section className="bg-[var(--qt-dark)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 sm:px-8 lg:grid-cols-2">
        <Reveal direction="left">
          <SectionTitle light>Built for Indian business owners</SectionTitle>
          <SectionSubtitle light className="mt-6 max-w-[461px]">
            Quotera helps you send professional quotations and invoices, track
            payments, and understand your revenue — without juggling spreadsheets
            and WhatsApp threads.
          </SectionSubtitle>
          <div className="mt-10 max-w-[461px]">
            <span className="text-[64px] leading-none text-[var(--qt-accent)]">&ldquo;</span>
            <p className="text-[18px] font-medium leading-[30px] text-[var(--qt-cream)]/70">
              Early access means you get the full product while we improve it
              with real feedback — no fake reviews, no inflated user counts.
            </p>
            <p className="mt-6 text-[18px] font-medium text-[var(--qt-cream)]/70">— Quotera team</p>
          </div>
        </Reveal>

        <Reveal direction="right" delay={120}>
          <div className="rounded-[20px] bg-[var(--qt-dark-card)] p-8 sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[10px] bg-[var(--qt-accent)] shadow-[0_12px_28px_rgb(var(--qt-accent-rgb)/0.35)]">
              <ArrowRight className="size-8 text-[var(--qt-brand)]" />
            </div>
            <h3 className="mt-6 text-center font-[family-name:var(--font-outfit)] text-[30px] font-medium text-[var(--qt-cream)]">
              Get started
            </h3>
            <p className="mt-3 text-center text-[16px] text-[var(--qt-cream)]/70">
              Create your account and start managing your business in minutes.
            </p>
            <div className="mt-8">
              <EarlyAccessCtaButton className="w-full !py-4" showArrow>
                Apply for early access
              </EarlyAccessCtaButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EarlyAccessSection() {
  return (
    <section id="early-access" className="scroll-mt-28 bg-[var(--qt-cream)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] items-start gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>Early access</Eyebrow>
          <SectionTitle className="mt-4">Get on the list</SectionTitle>
          <SectionSubtitle className="mt-4 max-w-md">
            We review each application and reach out on WhatsApp with an invite.
            No payment required during early access.
          </SectionSubtitle>
          <ul className="mt-8 space-y-3 text-[15px] text-[var(--qt-muted)]">
            <li>✓ About 2 minutes to complete</li>
            <li>✓ Tell us how you work today & what you can afford monthly</li>
            <li>✓ We review and contact you on WhatsApp — no instant signup</li>
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-[20px] border border-[var(--qt-brand)]/12 bg-[var(--qt-card)] p-6 shadow-[0_12px_40px_rgb(var(--qt-brand-rgb)/0.08)] sm:p-8">
            <EarlyAccessForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = [
    {
      title: "Support",
      links: [
        { label: "Help centre", href: "#faq" },
        { label: "WhatsApp support", href: "https://wa.me/919876543210" },
        { label: "Contact us", href: "mailto:hello@quotera.in" },
      ],
    },
    {
      title: "Help and Solution",
      links: [
        { label: "FAQ", href: "#faq" },
        { label: "Early access", href: "#pricing" },
        { label: "Documentation", href: "#" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Early access", href: "#early-access" },
      ],
    },
  ] as const;

  return (
    <footer className="bg-[var(--qt-dark)] pb-8 pt-16 text-[var(--qt-cream)]/70">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <QuoteraLogo size="xl" variant="on-dark" showTagline />
            <p className="mt-4 max-w-[286px] text-[18px] font-medium leading-[30px]">
              Client to payment management system for SMBs.
            </p>
            <div className="mt-8 max-w-[410px]">
              <EarlyAccessCtaButton className="w-full !rounded-[70px] !py-3" showArrow>
                Apply for early access
              </EarlyAccessCtaButton>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-[18px] font-medium text-[var(--qt-cream)]">{col.title}</p>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[18px] transition-colors duration-200 hover:text-[var(--qt-accent)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--qt-cream)]/10 pt-6 text-[16px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Quotera. Made with care in India.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-[var(--qt-cream)]">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-[var(--qt-cream)]">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <EarlyAccessCtaProvider>
      <LandingPageShell>
        <LandingNav />
        <main>
          <HeroSection />
          <TagsSection />
          <PartnerSection />
          <FeaturesSection />
          <BenefitsSection />
          <PricingSection />
          <EarlyAccessSection />
          <FaqSection />
          <DarkCtaSection />
        </main>
        <Footer />
      </LandingPageShell>
    </EarlyAccessCtaProvider>
  );
}
