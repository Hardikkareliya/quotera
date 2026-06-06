import { cn } from "@/lib/utils";

export function AuthFormHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Account
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-[30px] font-bold leading-tight tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-border via-border to-transparent" />
    </div>
  );
}
