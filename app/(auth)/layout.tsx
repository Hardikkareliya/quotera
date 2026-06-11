import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { QuoteraLogo } from "@/components/brand/quotera-logo";
import { ui } from "@/lib/colors";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={ui.authLayout}>
      <AuthBrandPanel />

      <div className="flex w-full flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:w-[48%] xl:w-1/2 lg:px-12 lg:py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 lg:hidden">
            <QuoteraLogo href="/" size="lg" variant="on-light" showTagline />
          </div>

          <div className={ui.authCard}>
            <div className="px-7 py-8 sm:px-9 sm:py-10">{children}</div>
          </div>

          <p className="mt-6 text-center text-[12px] text-muted-foreground">
            Secure sign-in powered by Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}
