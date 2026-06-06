"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { emailDocumentAction } from "@/actions/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildWhatsAppUrl,
  invoiceShareText,
  quotationShareText,
} from "@/lib/share";
import { formatMoney } from "@/lib/format";

type Props = {
  type: "quotation" | "invoice";
  id: string;
  number: string;
  total: string;
  companyName: string;
  /** Absolute PDF URL — must be computed on the server for hydration-safe share links. */
  pdfUrl: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
};

export function DocumentSharePanel({
  type,
  id,
  number,
  total,
  companyName,
  pdfUrl,
  clientPhone,
  clientEmail,
}: Props) {
  const [email, setEmail] = useState(clientEmail ?? "");
  const [emailPending, setEmailPending] = useState(false);

  const text =
    type === "quotation"
      ? quotationShareText({
          number,
          total: formatMoney(total).replace("₹", "").trim(),
          companyName,
        })
      : invoiceShareText({
          number,
          total: formatMoney(total).replace("₹", "").trim(),
          companyName,
        });

  const waUrl = clientPhone
    ? buildWhatsAppUrl(clientPhone, `${text}\n${pdfUrl}`)
    : `https://wa.me/?text=${encodeURIComponent(`${text}\n${pdfUrl}`)}`;

  async function sendEmail() {
    if (!email.trim()) {
      toast.error("Enter client email address");
      return;
    }
    setEmailPending(true);
    const result = await emailDocumentAction({
      type,
      id,
      toEmail: email.trim(),
      pdfUrl,
    });
    setEmailPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Email sent to client");
  }

  return (
    <div className="space-y-4 border-t border-border pt-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Send to client</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Share the PDF link via WhatsApp or email
        </p>
      </div>

      <Button
        variant="outline"
        className="h-11 w-full justify-center gap-2 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
        asChild
      >
        <a href={waUrl} target="_blank" rel="noreferrer">
          <MessageCircle className="size-4" />
          Share on WhatsApp
        </a>
      </Button>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <Label htmlFor="share-email" className="text-sm font-medium">
          Email PDF
        </Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="share-email"
            type="email"
            placeholder="client@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            className="h-11 shrink-0 gap-2 rounded-lg sm:min-w-[120px]"
            disabled={emailPending}
            onClick={sendEmail}
          >
            <Mail className="size-4" />
            {emailPending ? "Sending…" : "Send email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
