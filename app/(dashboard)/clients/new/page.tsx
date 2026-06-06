import { ClientForm } from "@/components/clients/client-form";
import { PageShell } from "@/components/layout/page-shell";

export default function NewClientPage() {
  return (
    <PageShell
      title="Add client"
      description="Contact and billing details for invoices"
      backHref="/clients"
      backLabel="Clients"
      breadcrumbs={[
        { label: "Clients", href: "/clients" },
        { label: "New" },
      ]}
    >
      <ClientForm cancelHref="/clients" />
    </PageShell>
  );
}
