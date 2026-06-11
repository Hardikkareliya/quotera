export const EARLY_ACCESS_NOTE =
  "Free during early access — no credit card. We're improving the product with real businesses.";

export const PLANNED_PRO_PRICE = "₹499";
export const PLANNED_PRO_PRICE_NOTE = "per month after public launch (planned)";

export const landingNav = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Early access", href: "#early-access" },
  { label: "FAQ", href: "#faq" },
] as const;

export const partnerFeatures = [
  {
    title: "Quotations",
    description:
      "Create GST-ready quotations with line items, live preview, and a PDF that matches what you see on screen.",
    icon: "activity" as const,
  },
  {
    title: "Invoices & payments",
    description:
      "Convert a quote to an invoice, record partial or full payments, and see what's still outstanding.",
    icon: "chart" as const,
  },
  {
    title: "Dashboard",
    description:
      "Track collected revenue, pending dues, and how your documents are spread across clients.",
    icon: "command" as const,
  },
] as const;

export const featureCards = [
  {
    title: "Clients",
    description:
      "Save contact details, billing address, GSTIN, and state — so every document pulls the right client info.",
    variant: "collab" as const,
  },
  {
    title: "Branded documents",
    description:
      "Add your logo, accent colour, bank details, signature, and UPI QR. PDF output matches the in-app preview.",
    variant: "storage" as const,
  },
  {
    title: "Business overview",
    description:
      "See revenue and outstanding amounts on the dashboard with simple charts — not a full accounting suite.",
    variant: "analytics" as const,
  },
] as const;

export const benefits = [
  "GST, IGST, or no-tax modes on each quotation and invoice",
  "Share PDF links via WhatsApp from any document",
  "Your branding on quotations and invoices you send",
  "Partial payments and outstanding balance on invoices",
  "Dashboard for revenue and pending dues",
] as const;

export const liveFeatures = [
  "Client directory with GSTIN & billing details",
  "Quotations with qty/rate or fixed line items",
  "GST / IGST / no-tax per document",
  "Convert quotation → invoice",
  "Partial & full payment tracking",
  "Branded PDF preview & download",
  "WhatsApp sharing",
  "Logo, colours, signature & UPI QR",
  "Revenue & outstanding dashboard",
] as const;

export const plannedFeatures = [
  "Paid Pro plan after public launch",
  "Team access for agencies",
  "Deeper reports & exports",
] as const;

export const faqItems = [
  {
    question: "How do I get early access?",
    answer:
      "Apply on this page with your name, WhatsApp number, email, and business type. We review applications and contact you on WhatsApp with an invite to create your account. It's free during early access.",
  },
  {
    question: "Is Quotera free right now?",
    answer:
      "Yes. Approved early access members can use the product for free while we improve it with real feedback. No credit card required.",
  },
  {
    question: "What can I actually do in Quotera today?",
    answer:
      "Manage clients, create GST-ready quotations and invoices, download branded PDFs, share via WhatsApp, record payments, and view revenue and outstanding amounts on your dashboard. Company branding and document settings are available under Settings.",
  },
  {
    question: "How does WhatsApp sharing work?",
    answer:
      "From a quotation or invoice, use share to open WhatsApp with a pre-filled message and link to the PDF. Your client gets a proper document, not a plain text quote.",
  },
  {
    question: "Can I customize invoices and quotations?",
    answer:
      "Yes. Upload your logo, choose document colours, toggle which company fields appear, and add signature and payment QR on invoices from Settings.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. Quotera is built for business owners. If you can use WhatsApp and email, you can use Quotera.",
  },
  {
    question: "What happens after early access?",
    answer:
      "We'll introduce a paid Pro plan. Early access users will get notice before anything changes, and founding users will receive preferential pricing.",
  },
  {
    question: "Is my business data secure?",
    answer:
      "Each organization's data is isolated with row-level security in Supabase. Only members of your account can access your clients and documents.",
  },
] as const;

export const businessTags = [
  "Freelancers",
  "Consultants",
  "Agencies",
  "Retail SMBs",
  "Service providers",
] as const;

export const BUSINESS_TYPE_VALUES = [
  "freelancer",
  "consultant",
  "agency",
  "retail_smb",
  "service_provider",
  "other",
] as const;

export type BusinessTypeValue = (typeof BUSINESS_TYPE_VALUES)[number];

export const businessTypeOptions: { value: BusinessTypeValue; label: string }[] = [
  { value: "freelancer", label: "Freelancer" },
  { value: "consultant", label: "Consultant" },
  { value: "agency", label: "Agency" },
  { value: "retail_smb", label: "Retail SMB" },
  { value: "service_provider", label: "Service provider" },
  { value: "other", label: "Other" },
];

export const MONTHLY_BUDGET_VALUES = [
  "under_299",
  "299_499",
  "500_999",
  "1000_plus",
  "free_only",
  "not_sure",
] as const;

export type MonthlyBudgetValue = (typeof MONTHLY_BUDGET_VALUES)[number];

export const monthlyBudgetOptions: { value: MonthlyBudgetValue; label: string }[] =
  [
    { value: "under_299", label: "Under ₹299/month" },
    { value: "299_499", label: "₹299 – ₹499/month" },
    { value: "500_999", label: "₹500 – ₹999/month" },
    { value: "1000_plus", label: "₹1,000+/month" },
    { value: "free_only", label: "Only if it's free" },
    { value: "not_sure", label: "Not sure yet" },
  ];

export const EARLY_ACCESS_FORM = {
  title: "Apply for early access",
  subtitle:
    "Share a few details — we'll review and reach out on WhatsApp with your invite.",
  successTitle: "You're on the list",
  successMessage:
    "Thanks for applying. We'll contact you within 24–48 hours on WhatsApp.",
  submitLabel: "Submit application",
  labels: {
    businessTypeOther: "Specify your business type",
    currentWorkflow: "How do you make quotations & invoices today?",
    needsNotes: "What do you need most from Quotera?",
    monthlyBudget: "What can you afford monthly?",
  },
  hints: {
    currentWorkflow: "Optional — e.g. Excel, Word, Refrens, WhatsApp messages",
    needsNotes: "Optional — your main pain point or goal",
  },
} as const;
