"use client";

import { useState } from "react";
import { toast } from "sonner";

import { emailDocumentAction } from "@/actions/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  clientPhone?: string | null;
  clientEmail?: string | null;
};

export function ShareActions({
  type,
  id,
  number,
  total,
  companyName,
  clientPhone,
  clientEmail,
}: Props) {
  const [email, setEmail] = useState(clientEmail ?? "");
  const pdfPath = `/api/pdf/${type}/${id}`;
  const pdfUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pdfPath}`
      : pdfPath;

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
    if (!email) {
      toast.error("Enter an email address");
      return;
    }
    const result = await emailDocumentAction({
      type,
      id,
      toEmail: email,
      pdfUrl,
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Email sent");
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={pdfPath} target="_blank" rel="noreferrer">
          Download PDF
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={waUrl} target="_blank" rel="noreferrer">
          Share on WhatsApp
        </a>
      </Button>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="client@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-8 w-48"
        />
        <Button type="button" variant="outline" size="sm" onClick={sendEmail}>
          Email PDF
        </Button>
      </div>
    </div>
  );
}
