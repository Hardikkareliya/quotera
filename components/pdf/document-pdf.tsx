import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { APP_NAME, APP_TAGLINE } from "@/lib/app-brand";
import {
  buildBillToDetailLines,
  clientToBillTo,
} from "@/lib/document-bill-to";
import { getDocumentTheme } from "@/lib/document-theme";
import { buildOrgDocumentHeader } from "@/lib/document-visibility";
import { formatShortDate } from "@/lib/format";
import {
  formatTaxRatePercent,
  isFixedPricing,
  lineQtyDisplay,
  lineRateDisplay,
} from "@/lib/line-items";
import { markdownToPlainText } from "@/lib/simple-markdown";
import { stateName } from "@/lib/indian-states";
import {
  computeLineTaxPaise,
  formatINRPdf,
  formatMoneyPdf,
  parseDecimalToPaise,
} from "@/lib/money";
import {
  isGstSplitMode,
  isTaxEnabled,
  parseTaxMode,
  taxColumnLabel,
} from "@/lib/tax-mode";
import type { Organization } from "@/types/database";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 44,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#171717",
  },
  accentBar: { height: 3, marginBottom: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 18,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
    maxWidth: "55%",
    alignItems: "flex-start",
  },
  headerRight: { width: 200, alignItems: "flex-end" },
  logo: {
    width: 100,
    height: 44,
    objectFit: "contain",
    objectPosition: "left",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  companyName: { fontSize: 11, fontWeight: "bold", marginBottom: 3 },
  muted: { fontSize: 8, color: "#525252", lineHeight: 1.4, marginBottom: 2 },
  docHeading: { fontSize: 20, fontWeight: "bold", letterSpacing: 0.5 },
  docNumber: { fontSize: 9, color: "#525252", marginTop: 6 },
  metaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 3,
    alignSelf: "flex-end",
  },
  metaLabel: { color: "#737373", fontSize: 9, marginRight: 10 },
  metaValue: { fontSize: 9, fontWeight: "bold" },
  section: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  billToName: { fontSize: 10, fontWeight: "bold", marginBottom: 3 },
  table: { marginTop: 14 },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 2,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableHeadText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "flex-start",
  },
  colDesc: { width: "38%" },
  colQty: { width: "10%", textAlign: "right" },
  colRate: { width: "16%", textAlign: "right" },
  colTax: { width: "12%", textAlign: "right" },
  colAmount: { width: "16%", textAlign: "right", fontWeight: "bold" },
  descTitle: { fontSize: 9, fontWeight: "bold", marginBottom: 2 },
  descSub: { fontSize: 8, color: "#525252", lineHeight: 1.35 },
  cell: { fontSize: 9, color: "#404040" },
  totalsWrap: { marginTop: 16, alignItems: "flex-end" },
  totalsBox: { width: 210 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: { color: "#525252", fontSize: 9 },
  totalValue: { fontSize: 9, fontWeight: "bold" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 6,
    marginTop: 2,
  },
  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 14,
  },
  notesCol: { width: "48%" },
  notesLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notesBody: { fontSize: 8, color: "#404040", lineHeight: 1.45 },
  paymentBlock: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 14,
  },
  paymentLeft: { flex: 1, paddingRight: 16 },
  bankTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#737373",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  qrBlock: { marginTop: 10, alignItems: "center", alignSelf: "flex-start" },
  qrImage: { width: 56, height: 56, objectFit: "contain" },
  qrCaption: { fontSize: 7, color: "#737373", marginTop: 3, textAlign: "center" },
  signatureBlock: { alignItems: "flex-end", alignSelf: "flex-end" },
  signature: {
    width: 120,
    height: 42,
    objectFit: "contain",
    objectPosition: "right",
    alignSelf: "flex-end",
  },
  signatureCaption: {
    fontSize: 7,
    color: "#737373",
    marginTop: 3,
    textAlign: "right",
  },
  poweredBy: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
    alignItems: "center",
  },
  poweredByText: { fontSize: 8, color: "#a3a3a3", textAlign: "center" },
  poweredByBrand: { fontWeight: "bold", color: "#737373" },
});

type LineItem = {
  description: string;
  sub_description?: string | null;
  pricing_mode?: string | null;
  hsn_sac: string | null;
  qty: string;
  unit_price: string;
  tax_rate: string;
  line_total: string;
};

type Props = {
  type: "quotation" | "invoice";
  org: Organization;
  doc: {
    number: string;
    issue_date: string;
    valid_until?: string | null;
    due_date?: string | null;
    subtotal: string;
    tax_total: string;
    total: string;
    tax_mode?: string | null;
    notes: string | null;
    terms: string | null;
  };
  client: {
    name: string;
    company: string | null;
    billing_address: string | null;
    gstin: string | null;
    state_code: string;
    phone?: string | null;
    email?: string | null;
  } | null;
  items: LineItem[];
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function lineGrossPaise(item: LineItem, taxEnabled: boolean): number {
  const taxablePaise = parseDecimalToPaise(item.line_total);
  return (
    taxablePaise +
    computeLineTaxPaise(taxablePaise, item.tax_rate, taxEnabled)
  );
}

export function DocumentPdf({ type, org, doc, client, items }: Props) {
  const theme = getDocumentTheme(org.document_theme, org.document_accent_custom);
  const docHeading = type === "quotation" ? "QUOTATION" : "TAX INVOICE";
  const secondaryLabel = type === "quotation" ? "Valid until" : "Due date";
  const secondaryDate =
    type === "quotation" ? doc.valid_until : doc.due_date;

  const taxMode = parseTaxMode(doc.tax_mode);
  const taxEnabled = isTaxEnabled(taxMode);
  const taxCol = taxColumnLabel(taxMode);
  const useGstSplit = taxEnabled && isGstSplitMode(taxMode);
  const taxTotalPaise = parseDecimalToPaise(doc.tax_total);

  const orgHeader = buildOrgDocumentHeader(org, type);
  const billTo = client ? clientToBillTo(client) : { name: "—" };
  const billToLines = buildBillToDetailLines(billTo);

  const filledItems = items.filter(
    (item) =>
      item.description?.trim() && parseDecimalToPaise(item.line_total) > 0,
  );

  const amountHeader = taxEnabled ? "Amount (incl. tax)" : "Amount";
  const subtotalLabel = taxEnabled ? "Subtotal (excl. tax)" : "Subtotal";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />

        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {orgHeader.logoUrl ? (
              <Image src={orgHeader.logoUrl} style={styles.logo} />
            ) : null}
            <Text style={styles.companyName}>{orgHeader.name}</Text>
            {orgHeader.lines.map((line, i) => (
              <Text key={`org-${i}`} style={styles.muted}>
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.headerRight}>
            <Text style={[styles.docHeading, { color: theme.accent }]}>
              {docHeading}
            </Text>
            <Text style={styles.docNumber}>{doc.number}</Text>
            <View style={{ marginTop: 10 }}>
              <MetaRow
                label="Issue date"
                value={formatShortDate(doc.issue_date)}
              />
              {secondaryDate?.trim() ? (
                <MetaRow
                  label={secondaryLabel}
                  value={formatShortDate(secondaryDate)}
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>
            Bill to
          </Text>
          <Text style={styles.billToName}>{billTo.name}</Text>
          {billToLines.map((line, i) => (
            <Text key={`bill-${i}`} style={styles.muted}>
              {line}
            </Text>
          ))}
          {billTo.stateCode ? (
            <Text style={styles.muted}>{stateName(billTo.stateCode)}</Text>
          ) : null}
        </View>

        <View style={styles.table}>
          <View
            style={[
              styles.tableHead,
              {
                backgroundColor: theme.tableHead,
                borderBottomColor: theme.accent,
              },
            ]}
          >
            <Text
              style={[styles.tableHeadText, styles.colDesc, { color: theme.accent }]}
            >
              Description
            </Text>
            <Text
              style={[styles.tableHeadText, styles.colQty, { color: theme.accent }]}
            >
              Qty
            </Text>
            <Text
              style={[styles.tableHeadText, styles.colRate, { color: theme.accent }]}
            >
              Rate
            </Text>
            {taxCol ? (
              <Text
                style={[styles.tableHeadText, styles.colTax, { color: theme.accent }]}
              >
                {taxCol}
              </Text>
            ) : null}
            <Text
              style={[
                styles.tableHeadText,
                styles.colAmount,
                { color: theme.accent },
              ]}
            >
              {amountHeader}
            </Text>
          </View>

          {filledItems.map((item, i) => {
            const previewItem = {
              pricingMode: item.pricing_mode,
              qty: String(item.qty),
              unitPrice: item.unit_price,
            };
            const sub = item.sub_description?.trim();

            return (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colDesc}>
                  <Text style={styles.descTitle}>{item.description}</Text>
                  {sub ? (
                    <Text style={styles.descSub}>
                      {markdownToPlainText(sub)}
                    </Text>
                  ) : null}
                </View>
                <Text style={[styles.cell, styles.colQty]}>
                  {lineQtyDisplay(previewItem)}
                </Text>
                <Text style={[styles.cell, styles.colRate]}>
                  {isFixedPricing(item.pricing_mode)
                    ? "—"
                    : formatMoneyPdf(lineRateDisplay(previewItem))}
                </Text>
                {taxCol ? (
                  <Text style={[styles.cell, styles.colTax]}>
                    {formatTaxRatePercent(item.tax_rate)}
                  </Text>
                ) : null}
                <Text style={[styles.cell, styles.colAmount]}>
                  {formatINRPdf(lineGrossPaise(item, taxEnabled))}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{subtotalLabel}</Text>
              <Text style={styles.totalValue}>{formatMoneyPdf(doc.subtotal)}</Text>
            </View>
            {taxEnabled && taxTotalPaise > 0 ? (
              useGstSplit ? (
                <>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>CGST</Text>
                    <Text style={styles.totalValue}>
                      {formatINRPdf(Math.floor(taxTotalPaise / 2))}
                    </Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>SGST</Text>
                    <Text style={styles.totalValue}>
                      {formatINRPdf(
                        taxTotalPaise - Math.floor(taxTotalPaise / 2),
                      )}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>IGST</Text>
                  <Text style={styles.totalValue}>
                    {formatMoneyPdf(doc.tax_total)}
                  </Text>
                </View>
              )
            ) : null}
            <View
              style={[styles.grandTotalRow, { borderTopColor: theme.accent }]}
            >
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>Total</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: theme.accent,
                }}
              >
                {formatMoneyPdf(doc.total)}
              </Text>
            </View>
          </View>
        </View>

        {doc.notes?.trim() || doc.terms?.trim() ? (
          <View style={styles.notesRow}>
            {doc.notes?.trim() ? (
              <View style={styles.notesCol}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesBody}>{doc.notes}</Text>
              </View>
            ) : (
              <View style={styles.notesCol} />
            )}
            {doc.terms?.trim() ? (
              <View style={styles.notesCol}>
                <Text style={styles.notesLabel}>Terms</Text>
                <Text style={styles.notesBody}>{doc.terms}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {orgHeader.bankLines.length > 0 ||
        orgHeader.paymentQrUrl ||
        orgHeader.signatureUrl ? (
          <View style={styles.paymentBlock}>
            <View style={styles.paymentLeft}>
              {orgHeader.bankLines.map((line, i) => (
                <Text
                  key={`bank-${i}`}
                  style={
                    i === 0
                      ? styles.bankTitle
                      : { fontSize: 8, color: "#525252", marginBottom: 2 }
                  }
                >
                  {line}
                </Text>
              ))}
              {orgHeader.paymentQrUrl ? (
                <View style={styles.qrBlock}>
                  <Image src={orgHeader.paymentQrUrl} style={styles.qrImage} />
                  <Text style={styles.qrCaption}>Scan to pay</Text>
                </View>
              ) : null}
            </View>
            {orgHeader.signatureUrl ? (
              <View style={styles.signatureBlock}>
                <Image src={orgHeader.signatureUrl} style={styles.signature} />
                <Text style={styles.signatureCaption}>
                  Authorised signatory
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.poweredBy} fixed>
          <Text style={styles.poweredByText}>
            Powered by <Text style={styles.poweredByBrand}>{APP_NAME}</Text> ·{" "}
            {APP_TAGLINE}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
