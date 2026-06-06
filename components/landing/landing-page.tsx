import Image from "next/image";
import Link from "next/link";
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
  earlyAccessFeatures,
  featureCards,
  LAUNCH_PROMO_CODE,
  LAUNCH_PROMO_LABEL,
  partnerFeatures,
} from "@/lib/landing-content";

import { FloatCard, Reveal } from "./landing-motion";
import { LandingNav } from "./landing-nav";
import { LandingPageShell } from "./landing-page-shell";
import { FlexHubLogo } from "@/components/brand/flexhub-logo";
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

const registerHref = `/register?promo=${LAUNCH_PROMO_CODE}`;

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
      <div className="flexhub-glow pointer-events-none absolute -right-10 top-0 size-56 rounded-full bg-[var(--fh-brand)]/20 blur-3xl" />
      <div
        className="flexhub-glow pointer-events-none absolute -left-8 bottom-10 size-44 rounded-full bg-[var(--fh-accent)]/15 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <FloatCard className="absolute -left-3 top-14 z-20 hidden sm:block">
        <FloatingChip>
          <p className="text-[12px] text-[var(--fh-muted)]">Enter amount</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-[16px] font-medium text-[var(--fh-ink)]">₹12,500</p>
            <span className="rounded-[40px] bg-[var(--fh-accent)] px-3 py-1 text-[13px] font-semibold text-[var(--fh-brand)]">
              Send
            </span>
          </div>
        </FloatingChip>
      </FloatCard>

      <div className="relative overflow-hidden rounded-[20px] border border-[var(--fh-brand)]/10 bg-[var(--fh-card)] shadow-[0_24px_60px_rgb(var(--fh-brand-rgb)/0.15)]">
        <div className="border-b border-[var(--fh-brand)]/8 bg-[var(--fh-cream-light)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-[var(--fh-ink)]">Dashboard</p>
              <p className="text-[12px] text-[var(--fh-muted)]">Welcome back 👋</p>
            </div>
            <span className="rounded-full bg-[var(--fh-brand)]/15 px-3 py-1 text-[11px] font-semibold text-[var(--fh-brand-text)]">
              Live
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
              className="rounded-[10px] border border-[var(--fh-brand)]/8 bg-[var(--fh-card)] p-3 transition-colors hover:border-[var(--fh-brand)]/25 hover:bg-[var(--fh-cream-light)]"
            >
              <div className="mb-2 flex size-8 items-center justify-center rounded-[8px] bg-[var(--fh-accent)]/20 text-[var(--fh-brand)]">
                <item.icon className="size-4" />
              </div>
              <p className="text-[18px] font-semibold text-[var(--fh-ink)]">{item.value}</p>
              <p className="text-[11px] text-[var(--fh-muted)]">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--fh-brand)]/8 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--fh-muted)]">
            Recent activity
          </p>
          <div className="space-y-2">
            {[
              { name: "TechCorp Solutions", status: "Paid", tone: "green" },
              { name: "Design Studio", status: "Pending", tone: "amber" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[8px] bg-[var(--fh-cream-light)] px-3 py-2"
              >
              <span className="text-[13px] font-medium text-[var(--fh-ink)]">{row.name}</span>
              <span
                className={
                  row.tone === "green"
                    ? "rounded-full bg-[var(--fh-brand)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--fh-brand)]"
                    : "rounded-full bg-[var(--fh-accent)]/25 px-2 py-0.5 text-[10px] font-semibold text-[var(--fh-brand)]"
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
          <p className="text-[12px] text-[var(--fh-muted)]">Total revenue</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-[16px] font-medium text-[var(--fh-ink)]">₹2.8L</p>
            <TrendingUp className="size-4 text-[var(--fh-brand)]" />
          </div>
        </FloatingChip>
      </FloatCard>

      <FloatCard delay={400} className="absolute -bottom-3 left-6 z-20 hidden sm:block">
        <div className="rounded-[10px] bg-[var(--fh-brand-dark)] px-4 py-3 shadow-[0_12px_32px_rgb(var(--fh-brand-rgb) /0.35)]">
          <p className="text-[12px] text-[var(--fh-cream)]/70">WhatsApp sent</p>
          <p className="mt-1 text-[14px] font-medium text-[var(--fh-cream)]">Invoice shared ✓</p>
        </div>
      </FloatCard>

      <div className="absolute bottom-20 -right-2 z-10 hidden size-10 rotate-12 items-center justify-center rounded-[10px] bg-[var(--fh-accent)] shadow-[0_8px_20px_rgb(var(--fh-accent-rgb)/0.4)] sm:flex">
        <MessageSquare className="size-5 text-[var(--fh-brand)]" />
      </div>
      <div className="absolute right-10 top-28 z-10 hidden size-11 -rotate-6 items-center justify-center rounded-[10px] bg-[var(--fh-brand-light)] shadow-[0_8px_20px_rgb(var(--fh-brand-rgb)/0.3)] sm:flex">
        <Sparkles className="size-5 text-[var(--fh-cream)]" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="flexhub-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[var(--fh-brand)]/12 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-[555px]">
          <div className="flexhub-enter">
            <Eyebrow>Early access · India</Eyebrow>
          </div>

          <h1 className="flexhub-enter flexhub-enter-1 mt-6 font-[family-name:var(--font-outfit)] text-[40px] font-bold leading-[1.08] tracking-tight text-[var(--fh-ink)] sm:text-[56px] lg:text-[68px] lg:leading-[1.05]">
            Run your business{" "}
            <span className="text-[var(--fh-brand)]">like a pro</span>
          </h1>

          <div className="flexhub-enter flexhub-enter-2 mt-8 h-[3px] w-full max-w-[479px] rounded-full bg-gradient-to-r from-[var(--fh-accent)] via-[var(--fh-brand)] to-transparent" />

          <p className="flexhub-enter flexhub-enter-2 mt-8 max-w-[461px] text-[16px] font-medium leading-[30px] text-[var(--fh-ink)] sm:text-[18px]">
            Manage clients, GST quotations, invoices, and payments in one beautiful
            dashboard — built for Indian freelancers and SMBs.
          </p>

          <div className="flexhub-enter flexhub-enter-3 mt-10 flex flex-wrap items-center gap-4">
            <FigmaButton href={registerHref} showArrow>
              Start free access
            </FigmaButton>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-[18px] font-medium text-[var(--fh-ink)] transition-colors hover:text-[var(--fh-brand)]"
            >
              Sign in
            </Link>
          </div>

          <p className="flexhub-enter flexhub-enter-4 mt-6 inline-flex flex-wrap items-center gap-2 text-[14px] font-medium text-[var(--fh-muted)]">
            <span className="rounded-full bg-[var(--fh-accent)]/25 px-3 py-1 font-semibold text-[var(--fh-brand)]">
              {LAUNCH_PROMO_CODE}
            </span>
            {LAUNCH_PROMO_LABEL}
          </p>
        </div>

        <div className="flexhub-enter flexhub-enter-2">
          <DashboardHero />
        </div>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-[1180px] gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {stats.map((item, i) => (
          <Reveal key={item.label} delay={i * 60}>
            <div className="flex h-full min-h-[88px] flex-col items-center justify-center rounded-[16px] border border-[var(--fh-brand)]/10 bg-[var(--fh-card)] px-4 py-4 text-center shadow-[0_4px_16px_rgb(var(--fh-brand-rgb) /0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--fh-accent)]/40 hover:shadow-[0_12px_28px_rgb(var(--fh-brand-rgb)/0.12)]">
              <p className="font-[family-name:var(--font-outfit)] text-[22px] font-bold text-[var(--fh-brand)] sm:text-[24px]">{item.label}</p>
              <p className="mt-1 text-[13px] font-medium text-[var(--fh-muted)] sm:text-[14px]">
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
    <section className="overflow-hidden border-y border-[var(--fh-brand)]/10 bg-[var(--fh-cream-light)] py-10">
      <Reveal className="mx-auto max-w-[1180px] px-4 text-center sm:px-8">
        <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[var(--fh-muted)]">
          Built for Indian businesses
        </p>
      </Reveal>
      <div className="relative mt-6 overflow-hidden">
        <div className="flexhub-marquee flex w-max gap-12 px-4">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="whitespace-nowrap font-[family-name:var(--font-outfit)] text-[22px] font-semibold text-[var(--fh-brand)]/25 transition-colors hover:text-[var(--fh-brand)] sm:text-[26px]"
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
    <section className="bg-[var(--fh-surface)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="left">
          <Eyebrow>Workflow</Eyebrow>
          <SectionTitle className="mt-4">
            How FlexHub supports your daily workflow
          </SectionTitle>
          <SectionSubtitle className="mt-6 max-w-[644px]">
            From first quotation to final payment — one platform for clients,
            documents, and business visibility. No spreadsheet patchwork, no
            WhatsApp chaos.
          </SectionSubtitle>
          <div className="mt-10 inline-flex items-center gap-3 rounded-[10px] border border-[var(--fh-brand)]/12 bg-[var(--fh-card)] px-4 py-3 shadow-[0_4px_16px_rgb(var(--fh-brand-rgb) /0.06)]">
            <span className="flex size-2 animate-pulse rounded-full bg-[var(--fh-accent)]" />
            <p className="text-[16px] font-medium text-[var(--fh-ink)]">
              Early access open — help shape the product
            </p>
          </div>
        </Reveal>

        <div className="space-y-5">
          {partnerFeatures.map((item, i) => {
            const Icon = partnerIcons[item.icon];
            return (
              <Reveal key={item.title} delay={i * 90} direction="right">
                <div className="group flex gap-5 rounded-[16px] border border-transparent bg-[var(--fh-card)]/80 p-4 transition-all duration-300 hover:border-[var(--fh-brand)]/15 hover:bg-[var(--fh-card)] hover:shadow-[0_12px_28px_rgb(var(--fh-brand-rgb)/0.08)]">
                  <div className="flex size-[60px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--fh-accent)]/15 shadow-[0_4px_12px_rgb(var(--fh-brand-rgb) /0.06)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-7 text-[var(--fh-brand)]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-outfit)] text-[22px] font-bold text-[var(--fh-ink)] sm:text-[28px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[428px] text-[16px] font-medium leading-[28px] text-[var(--fh-muted)] sm:text-[18px]">
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
    "flex h-[220px] items-center justify-center border-b border-[var(--fh-brand)]/10 bg-[var(--fh-cream-light)] p-6";

  if (variant === "collab") {
    return (
      <div className={previewShell}>
        <div className="flex -space-x-3">
          {["RP", "PS", "AK"].map((initial, i) => (
            <div
              key={initial}
              className="flex size-14 items-center justify-center rounded-full border-4 border-[var(--fh-card)] text-sm font-bold text-[var(--fh-cream)] shadow-md"
              style={{ background: ["var(--fh-brand)", "var(--fh-brand-light)", "#2a5c4d"][i], zIndex: 3 - i }}
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
        <div className="w-full max-w-[280px] rounded-[12px] border border-[var(--fh-brand)]/12 bg-[var(--fh-card)] p-4 shadow-[0_8px_20px_rgb(var(--fh-brand-rgb)/0.08)]">
          <p className="text-[12px] font-medium text-[var(--fh-muted)]">Document file</p>
          <p className="mt-2 text-[16px] font-semibold text-[var(--fh-ink)]">
            Invoice #INV-1042.pdf
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--fh-brand)]/10">
            <div className="h-full w-3/4 rounded-full bg-[var(--fh-brand)] transition-all duration-1000" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={previewShell}>
      <div className="relative flex size-32 items-center justify-center rounded-full border-[10px] border-[var(--fh-brand)]/15 bg-[var(--fh-card)]">
        <div className="absolute inset-3 rounded-full border-[10px] border-[var(--fh-brand)] border-r-transparent" />
        <span className="text-[22px] font-bold text-[var(--fh-brand)]">78%</span>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-[var(--fh-cream-light)]/40 py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow>Capabilities</Eyebrow>
          <SectionTitle className="mt-4">Our Features</SectionTitle>
          <SectionSubtitle className="mx-auto mt-4 max-w-2xl">
            Everything you need to look professional and stay organized — from
            first quote to final payment.
          </SectionSubtitle>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featureCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <FigmaCard className="flex h-full flex-col overflow-hidden">
                <FeaturePreview variant={card.variant} />
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-[family-name:var(--font-outfit)] text-[24px] font-bold text-[var(--fh-ink)] sm:text-[28px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[16px] font-medium leading-[28px] text-[var(--fh-muted)] sm:text-[18px]">
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
          <SectionTitle className="mt-4">What benefit will you get</SectionTitle>
          <ul className="mt-10 space-y-5">
            {benefits.map((item) => (
              <FigmaCheck key={item}>{item}</FigmaCheck>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="right" delay={120} className="relative">
          <div className="overflow-hidden rounded-[20px] bg-[var(--fh-cream-light)] ring-1 ring-[var(--fh-brand)]/10">
            <Image
              src="/landing/hero-person.jpg"
              alt="FlexHub benefits"
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
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--fh-brand)]/15 text-sm font-bold text-[var(--fh-brand)]">
                  FH
                </div>
                <div>
                  <p className="text-[16px] font-medium text-[var(--fh-ink)]">FlexHub user</p>
                  <p className="text-[12px] text-[var(--fh-muted)]">Early access member</p>
                </div>
              </div>
            </FloatingChip>
          </FloatCard>
          <FloatCard delay={600} className="absolute bottom-8 left-8">
            <FloatingChip>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[var(--fh-brand)]" />
                <p className="text-[15px] font-medium text-[var(--fh-ink)]">Payment recorded</p>
              </div>
            </FloatingChip>
          </FloatCard>
          <FloatCard delay={300} className="absolute -right-2 top-1/3 hidden sm:block">
            <FloatingChip>
              <p className="text-[12px] text-[var(--fh-muted)]">Total income</p>
              <p className="text-[16px] font-medium text-[var(--fh-ink)]">₹2,45,000</p>
            </FloatingChip>
          </FloatCard>
        </Reveal>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-[var(--fh-cream-light)] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <SectionTitle className="mt-4">
            Choose plan
            <br />
            that&apos;s right for you
          </SectionTitle>
          <SectionSubtitle className="mx-auto mt-4 max-w-2xl">
            We&apos;re validating with real businesses — start with limited-time
            free access. Use code {LAUNCH_PROMO_CODE} for {LAUNCH_PROMO_LABEL}.
          </SectionSubtitle>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[980px] gap-6 lg:grid-cols-3 lg:items-stretch">
          <Reveal delay={0}>
            <FigmaCard className="flex h-full min-h-[580px] flex-col p-8">
              <p className="text-[30px] font-semibold text-[var(--fh-ink)]">Pro</p>
              <p className="mt-4 text-[16px] font-medium leading-[27px] text-[var(--fh-muted)]">
                Paid plans after public launch
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-[18px] font-medium text-[var(--fh-muted)]">₹</span>
                <span className="text-[50px] font-semibold leading-none text-[var(--fh-ink)]">—</span>
              </div>
              <div className="mt-8 flex-1 rounded-[10px] bg-[var(--fh-cream)]/60 p-6">
                <ul className="space-y-4 text-[18px] font-medium text-[var(--fh-ink)]">
                  <li>Coming soon</li>
                  <li>Priority support</li>
                  <li>Advanced analytics</li>
                </ul>
              </div>
              <FigmaButton
                href="mailto:hello@flexhub.in"
                variant="white"
                className="mt-8 w-full !py-4"
              >
                Notify me
              </FigmaButton>
            </FigmaCard>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative flex h-full min-h-[620px] flex-col overflow-hidden rounded-[20px] bg-[var(--fh-brand)] p-8 shadow-[0_24px_60px_rgb(var(--fh-brand-rgb)/0.35)] transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute -bottom-24 -left-24 size-[320px] rounded-full bg-[var(--fh-accent)]/10" />
              <div className="absolute -right-16 -top-16 size-[200px] rounded-full bg-[var(--fh-cream)]/5" />
              <span className="relative inline-flex w-fit rounded-[10px] bg-[var(--fh-accent)] px-4 py-2 text-[14px] font-semibold text-[var(--fh-brand)]">
                Early access — open now
              </span>
              <p className="relative mt-6 font-[family-name:var(--font-outfit)] text-[30px] font-semibold text-[var(--fh-cream)]">Free access</p>
              <p className="relative mt-4 max-w-[240px] text-[18px] font-medium leading-[27px] text-[var(--fh-cream)]/90">
                Full platform while we launch — no credit card required
              </p>
              <div className="relative mt-6 flex items-end gap-1 text-[var(--fh-cream)]">
                <span className="text-[18px] font-medium">₹</span>
                <span className="text-[50px] font-semibold leading-none">0</span>
              </div>
              <div className="relative mt-8 flex-1 rounded-[10px] bg-[var(--fh-card)] p-6">
                <ul className="space-y-3">
                  {earlyAccessFeatures.slice(0, 6).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[16px] font-medium text-[var(--fh-ink)]"
                    >
                      <span className="mt-0.5 text-[var(--fh-accent)]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <FigmaButton
                href={registerHref}
                className="relative mt-8 w-full !py-4"
                showArrow
              >
                Get early access
              </FigmaButton>
              <p className="relative mt-3 text-center text-[14px] text-[var(--fh-cream)]/85">
                Code {LAUNCH_PROMO_CODE} → {LAUNCH_PROMO_LABEL}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <FigmaCard className="flex h-full min-h-[580px] flex-col p-8">
              <p className="text-[30px] font-semibold text-[var(--fh-ink)]">Enterprise</p>
              <p className="mt-4 text-[16px] font-medium leading-[27px] text-[var(--fh-muted)]">
                For teams and agencies with custom needs
              </p>
              <div className="mt-6">
                <span className="text-[50px] font-semibold leading-none text-[var(--fh-ink)]">
                  Custom
                </span>
              </div>
              <div className="mt-8 flex-1 rounded-[10px] bg-[var(--fh-cream)]/60 p-6">
                <ul className="space-y-4 text-[18px] font-medium text-[var(--fh-ink)]">
                  <li>Multi-user access</li>
                  <li>Team management</li>
                  <li>Dedicated support</li>
                  <li>Custom integrations</li>
                </ul>
              </div>
              <FigmaButton
                href="mailto:hello@flexhub.in"
                variant="white"
                className="mt-8 w-full !py-4"
              >
                Contact us
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
    <section className="bg-[var(--fh-dark)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 sm:px-8 lg:grid-cols-2">
        <Reveal direction="left">
          <SectionTitle light>Built for Indian business owners</SectionTitle>
          <SectionSubtitle light className="mt-6 max-w-[461px]">
            FlexHub helps you send professional quotations and invoices, track
            payments, and understand your revenue — without juggling spreadsheets
            and WhatsApp threads.
          </SectionSubtitle>
          <div className="mt-10 max-w-[461px]">
            <span className="text-[64px] leading-none text-[var(--fh-accent)]">&ldquo;</span>
            <p className="text-[18px] font-medium leading-[30px] text-[var(--fh-cream)]/70">
              Early access means you get the full product while we improve it
              with real feedback — no fake reviews, no inflated user counts.
            </p>
            <p className="mt-6 text-[18px] font-medium text-[var(--fh-cream)]/70">— FlexHub team</p>
          </div>
        </Reveal>

        <Reveal direction="right" delay={120}>
          <div className="rounded-[20px] bg-[var(--fh-dark-card)] p-8 sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[10px] bg-[var(--fh-accent)] shadow-[0_12px_28px_rgb(var(--fh-accent-rgb)/0.35)]">
              <ArrowRight className="size-8 text-[var(--fh-brand)]" />
            </div>
            <h3 className="mt-6 text-center font-[family-name:var(--font-outfit)] text-[30px] font-medium text-[var(--fh-cream)]">
              Get started
            </h3>
            <p className="mt-3 text-center text-[16px] text-[var(--fh-cream)]/70">
              Create your account and start managing your business in minutes.
            </p>
            <div className="mt-8 space-y-5">
              <FigmaButton href={registerHref} className="w-full !py-4" showArrow>
                Start free access
              </FigmaButton>
              <p className="text-center text-[14px] text-[var(--fh-cream)]/70">
                or{" "}
                <Link href="/login" className="text-[var(--fh-accent)] transition-colors hover:text-[var(--fh-cream)]">
                  Sign in
                </Link>
              </p>
            </div>
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
        { label: "Contact us", href: "mailto:hello@flexhub.in" },
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
        { label: "Sign up", href: registerHref },
      ],
    },
  ] as const;

  return (
    <footer className="bg-[var(--fh-dark)] pb-8 pt-16 text-[var(--fh-cream)]/70">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <FlexHubLogo size="xl" variant="on-dark" showTagline />
            <p className="mt-4 max-w-[286px] text-[18px] font-medium leading-[30px]">
              India&apos;s business OS for clients, quotations, invoices, and payments.
            </p>
            <a
              href={registerHref}
              className="group mt-8 flex max-w-[410px] items-center rounded-[70px] border-2 border-[var(--fh-cream)]/30 px-5 py-3 transition-all duration-300 hover:border-[var(--fh-accent)] hover:bg-[var(--fh-accent)]/10"
            >
              <span className="flex-1 text-[16px] text-[var(--fh-cream)]">Get early access</span>
              <span className="flex size-[46px] items-center justify-center rounded-full bg-[var(--fh-accent)] transition-transform duration-300 group-hover:scale-105">
                <ArrowRight className="size-5 text-[var(--fh-brand)]" />
              </span>
            </a>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-[18px] font-medium text-[var(--fh-cream)]">{col.title}</p>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[18px] transition-colors duration-200 hover:text-[var(--fh-accent)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--fh-cream)]/10 pt-6 text-[16px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FlexHub. Made with care in India.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-[var(--fh-cream)]">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-[var(--fh-cream)]">
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
    <LandingPageShell>
      <LandingNav registerHref={registerHref} />
      <main>
        <HeroSection />
        <TagsSection />
        <PartnerSection />
        <FeaturesSection />
        <BenefitsSection />
        <PricingSection />
        <FaqSection />
        <DarkCtaSection />
      </main>
      <Footer />
    </LandingPageShell>
  );
}
