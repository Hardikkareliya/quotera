"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqItems } from "@/lib/landing-content";

import { Reveal } from "./landing-motion";
import { Eyebrow, SectionSubtitle, SectionTitle } from "./landing-ui";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--fh-cream)] py-20 sm:py-28">
      <div className="mx-auto max-w-[820px] px-4 sm:px-8">
        <Reveal className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <SectionTitle className="mt-4 text-[36px] sm:text-[50px]">
            Frequently Asked Questions
          </SectionTitle>
          <SectionSubtitle className="mx-auto mt-4 max-w-xl">
            Everything you need to know about FlexHub early access
          </SectionSubtitle>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={item.question} delay={index * 50}>
                <div
                  className={cn(
                    "overflow-hidden rounded-[12px] border bg-[var(--fh-card)] transition-all duration-300",
                    open
                      ? "border-[var(--fh-accent)]/50 shadow-[0_12px_32px_rgb(var(--fh-brand-rgb)/0.1)]"
                      : "border-[var(--fh-brand)]/10 hover:border-[var(--fh-brand)]/25",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--fh-cream-light)]/80"
                  >
                    <span className="text-[16px] font-semibold text-[var(--fh-ink)] sm:text-[18px]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-[var(--fh-accent)] transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[var(--fh-brand)]/8 px-5 pb-4 pt-3">
                        <p className="text-[16px] leading-[28px] text-[var(--fh-muted)]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={100} className="mt-10 text-center">
          <p className="text-[14px] text-[var(--fh-muted)]">Still have questions?</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-[10px] bg-[var(--fh-brand)] px-5 py-2.5 text-[14px] font-semibold text-[var(--fh-cream)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--fh-brand-dark)] hover:shadow-[0_12px_24px_rgb(var(--fh-brand-rgb)/0.35)]"
            >
              WhatsApp Support
            </a>
            <a
              href="mailto:hello@flexhub.in"
              className="inline-flex items-center rounded-[10px] border border-[var(--fh-brand)]/15 bg-[var(--fh-card)] px-5 py-2.5 text-[14px] font-semibold text-[var(--fh-brand)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--fh-accent)] hover:bg-[var(--fh-accent)]/10"
            >
              Email us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
