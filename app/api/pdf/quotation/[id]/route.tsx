import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { DocumentPdf } from "@/components/pdf/document-pdf";
import { fetchQuotationPdfData } from "@/lib/pdf-fetch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await fetchQuotationPdfData(id);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <DocumentPdf
      type="quotation"
      org={data.org}
      doc={data.quote}
      client={data.client}
      items={data.items}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="quotation-${data.quote.number}.pdf"`,
    },
  });
}
