import { cn } from "@/lib/utils";

type LandingPageShellProps = {
  children: React.ReactNode;
};

export function LandingPageShell({ children }: LandingPageShellProps) {
  return (
    <div
      className={cn(
        "quotera-page scroll-smooth bg-[var(--qt-cream)] text-[var(--qt-ink)] antialiased",
      )}
    >
      {children}
    </div>
  );
}
