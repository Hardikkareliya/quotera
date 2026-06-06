import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { DocumentPdf } from "@/components/pdf/document-pdf";
import { fetchInvoicePdfData } from "@/lib/pdf-fetch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await fetchInvoicePdfData(id);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <DocumentPdf
      type="invoice"
      org={data.org}
      doc={data.invoice}
      client={data.client}
      items={data.items}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${data.invoice.number}.pdf"`,
    },
  });
}
