import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold">
            F
          </div>
          <h1 className="mt-10 text-4xl font-bold leading-tight">
            Run your business in one place
          </h1>
          <p className="mt-4 max-w-md text-base text-primary-foreground/80">
            Clients, quotations, invoices, and payments — built for Indian
            freelancers and small businesses.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          © FlexHub Business OS
        </p>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <Link href="/" className="text-2xl font-bold text-foreground">
            FlexHub
          </Link>
        </div>
        <div className="w-full max-w-md rounded-[20px] bg-card p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
