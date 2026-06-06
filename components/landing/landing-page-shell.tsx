import { cn } from "@/lib/utils";

type LandingPageShellProps = {
  children: React.ReactNode;
};

export function LandingPageShell({ children }: LandingPageShellProps) {
  return (
    <div
      className={cn(
        "flexhub-page scroll-smooth bg-[var(--fh-cream)] text-[var(--fh-ink)] antialiased",
      )}
    >
      {children}
    </div>
  );
}
