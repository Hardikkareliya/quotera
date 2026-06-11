"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Dialog } from "@/components/ui/dialog";
import { EARLY_ACCESS_FORM } from "@/lib/landing-content";

import { EarlyAccessForm } from "./early-access-form";
import { FigmaButtonAction, type FigmaButtonVariant } from "./landing-ui";

type CtaContextValue = {
  open: () => void;
};

const EarlyAccessCtaContext = createContext<CtaContextValue | null>(null);

export function EarlyAccessCtaProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openForm = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollToSection = () => {
      document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" });
    };
    if (window.location.hash === "#early-access") {
      setOpen(true);
      scrollToSection();
    }
    const onHashChange = () => {
      if (window.location.hash === "#early-access") {
        setOpen(true);
        scrollToSection();
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <EarlyAccessCtaContext.Provider value={{ open: openForm }}>
      {children}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={EARLY_ACCESS_FORM.title}
        description={EARLY_ACCESS_FORM.subtitle}
        className="max-w-md"
      >
        <EarlyAccessForm compact onSuccess={() => setOpen(false)} />
      </Dialog>
    </EarlyAccessCtaContext.Provider>
  );
}

function useEarlyAccessCta() {
  const ctx = useContext(EarlyAccessCtaContext);
  if (!ctx) {
    throw new Error("EarlyAccessCtaButton must be used within EarlyAccessCtaProvider");
  }
  return ctx;
}

export function EarlyAccessCtaButton({
  children,
  className,
  variant = "primary",
  showArrow,
  onAfterClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: FigmaButtonVariant;
  showArrow?: boolean;
  onAfterClick?: () => void;
}) {
  const { open } = useEarlyAccessCta();

  return (
    <FigmaButtonAction
      type="button"
      variant={variant}
      className={className}
      showArrow={showArrow}
      onClick={() => {
        open();
        onAfterClick?.();
      }}
    >
      {children}
    </FigmaButtonAction>
  );
}
