export const LAUNCH_PROMO_CODE = "LAUNCH2026";
export const LAUNCH_PROMO_LABEL = "3 months free on early access";

export const landingNav = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const partnerFeatures = [
  {
    title: "Quotations",
    description:
      "Create branded GST quotations in seconds and share professional PDFs via WhatsApp.",
    icon: "activity" as const,
  },
  {
    title: "Invoices",
    description:
      "Convert quotes to invoices, track partial payments, and keep every document on-brand.",
    icon: "chart" as const,
  },
  {
    title: "Dashboard",
    description:
      "See revenue, pending dues, and client activity in one clean business dashboard.",
    icon: "command" as const,
  },
] as const;

export const featureCards = [
  {
    title: "Client management",
    description:
      "Store client details, GSTIN, and contact info in one searchable place — no spreadsheet chaos.",
    variant: "collab" as const,
  },
  {
    title: "Branded documents",
    description:
      "Quotations and invoices with your logo, colours, signature, and UPI QR on every PDF.",
    variant: "storage" as const,
  },
  {
    title: "Business analytics",
    description:
      "Track revenue trends, pending invoices, and monthly totals from a real-time dashboard.",
    variant: "analytics" as const,
  },
] as const;

export const benefits = [
  "GST-ready quotations & invoices out of the box",
  "WhatsApp sharing for faster client communication",
  "Custom branding on every document you send",
  "Payment tracking with partial payment support",
  "Dashboard to see revenue and pending dues",
] as const;

export const faqItems = [
  {
    question: "Is Quotera free right now?",
    answer:
      "Yes — we're in early access. Sign up for limited-time free access while we validate the product with real businesses. Use promo code LAUNCH2026 when you register for 3 months free.",
  },
  {
    question: "How does WhatsApp sharing work?",
    answer:
      "From any quotation or invoice, tap share to open WhatsApp with a pre-filled message and PDF link. Your client gets a professional document, not a plain text quote.",
  },
  {
    question: "Can I customize invoices and quotations?",
    answer:
      "Yes. Upload your logo, pick document colours, toggle which fields appear, and add signature and payment QR on invoices.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. Quotera is built for business owners, not developers. If you can use WhatsApp and email, you can use Quotera.",
  },
  {
    question: "What happens to my data if I stop using Quotera?",
    answer:
      "Your data remains in your Supabase-backed account. You can export PDFs anytime. We never sell your business data.",
  },
  {
    question: "Is my business data secure?",
    answer:
      "Yes. Each organization's data is isolated with row-level security. Only members of your org can access your clients and documents.",
  },
] as const;

export const earlyAccessFeatures = [
  "Unlimited clients",
  "Quotations & invoices",
  "GST / IGST tax modes",
  "Branded PDF preview & download",
  "WhatsApp sharing",
  "Payment tracking",
  "Custom branding",
  "UPI QR on invoices",
  "Dashboard analytics",
  "Early-access support",
] as const;

export const businessTags = [
  "Freelancers",
  "Consultants",
  "Agencies",
  "Retail SMBs",
  "Service providers",
] as const;
