# FlexHub

**Business invoicing made simple** — manage clients, GST quotations, tax invoices, and payments in one place. Built for Indian freelancers, agencies, and small businesses.

## Features

- **Clients** — contact details, billing address, GSTIN, state (place of supply)
- **Quotations** — line items (qty/rate or fixed), GST / IGST / no tax, live preview, PDF download
- **Invoices** — convert from quote, partial & full payments, outstanding tracking
- **Documents** — themed PDFs matching on-screen preview (accent colour, logo, bank, signature, UPI QR)
- **Settings** — company profile, document visibility toggles, preset + custom theme colours
- **Dashboard** — revenue, outstanding, client & document counts
- **Share** — WhatsApp link + optional email (Resend)

## Tech stack

| Layer | Technology |
|-------|------------|
| App | Next.js 15 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui |
| Backend | Supabase (Auth, PostgreSQL, Row Level Security, Storage) |
| PDF | `@react-pdf/renderer` |
| Email | Resend (optional) |
| Hosting | Vercel |

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- (Optional) [Resend](https://resend.com) account for email share
- (Optional) [Vercel](https://vercel.com) account for deployment

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/FlexHub.git
cd FlexHub
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | Yes | App URL — `http://localhost:3000` locally |
| `RESEND_API_KEY` | No | Email share via Resend |
| `RESEND_FROM_EMAIL` | No | e.g. `FlexHub <onboarding@resend.dev>` |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-only; not needed for normal app use |
| `DATABASE_URL` | No | Only if running `npm run db:migrate` CLI script |

Never commit `.env.local` — it is listed in `.gitignore`.

### 3. Database migrations

Open the [Supabase SQL Editor](https://supabase.com/dashboard) for your project and run each file **in order** (copy/paste full file contents, then Run):

| Order | File | Purpose |
|-------|------|---------|
| 1 | `supabase/migrations/20250604000001_initial_schema.sql` | Tables, RLS, numbering, storage bucket |
| 2 | `supabase/migrations/20250604000002_bootstrap_user_org.sql` | Auto-create org on signup |
| 3 | `supabase/migrations/20250604000003_organization_contact.sql` | Email, phone, website on org |
| 4 | `supabase/migrations/20250604000004_line_item_flexibility.sql` | Fixed pricing, sub-descriptions |
| 5 | `supabase/migrations/20250604000005_tax_mode.sql` | GST / IGST tax modes |
| 6 | `supabase/migrations/20250604000006_tax_mode_none.sql` | “No tax” option |
| 7 | `supabase/migrations/20250604000007_document_visibility.sql` | Per-field PDF/preview toggles |
| 8 | `supabase/migrations/20250604000008_document_theme.sql` | Document accent presets |
| 9 | `supabase/migrations/20250604000009_document_theme_custom.sql` | Custom hex accent colour |

Skip `20250604000000_reset_dev.sql` unless you intentionally want to wipe dev data.

### 4. Supabase Auth (local)

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** add `http://localhost:3000/**`

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register a new account, and complete company setup under **Settings**.

### 6. Production build (optional check)

```bash
npm run build
npm start
```

---

## Deploy to Vercel (via GitHub)

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/FlexHub.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (same as `.env.local`, but use your production URL):

   | Variable | Production value |
   |----------|------------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
   | `RESEND_API_KEY` | Optional |
   | `RESEND_FROM_EMAIL` | Optional |

4. Click **Deploy**.

After the first deploy, copy the live Vercel URL, set `NEXT_PUBLIC_SITE_URL` to that exact URL, and **Redeploy**.

### 3. Supabase Auth (production)

In **Authentication → URL Configuration**:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** add `https://your-app.vercel.app/**` and keep `http://localhost:3000/**` for local dev.

### 4. Migrations on production

Run the same migration files (steps 1–9 above) on your **production** Supabase project if you have not already.

Every `git push` to `main` triggers an automatic Vercel redeploy.

---

## App routes

| Route | Description |
|-------|-------------|
| `/` | Landing |
| `/login`, `/register`, `/forgot-password` | Authentication |
| `/dashboard` | Overview & charts |
| `/clients`, `/clients/new`, `/clients/[id]` | Client management |
| `/quotations`, `/quotations/new`, `/quotations/[id]` | Quotations + preview + PDF |
| `/invoices`, `/invoices/new`, `/invoices/[id]` | Invoices, payments, PDF |
| `/settings` | Company profile, branding, document options |
| `/api/pdf/quotation/[id]` | Quotation PDF |
| `/api/pdf/invoice/[id]` | Invoice PDF |

---

## Document & tax behaviour

- **Tax modes:** None, GST (CGST + SGST), or IGST — per document.
- **Line amounts:** Rate column shows taxable value; Amount column shows tax-inclusive total when tax is enabled.
- **PDF preview parity:** PDF layout, colours, totals, and footer match the in-app preview.
- **Visibility:** Settings toggles control which company fields, logo, bank, signature, and QR appear on documents.

---

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint
npm run db:migrate  # Apply migrations via DATABASE_URL (optional CLI)
```

---

## Regenerate TypeScript types (optional)

After schema changes:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.generated.ts
```

---

## Security notes

- All tenant data is scoped by organization with Supabase **Row Level Security**.
- Users only see data for organizations they belong to.
- Store secrets in environment variables only — never in the repository.
- Test isolation: register two users in separate browsers and confirm they cannot see each other's clients or documents.

---

## License

Private project — all rights reserved.
