import { notFound } from "next/navigation";

import { ClientForm } from "@/components/clients/client-form";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { org } = await getCurrentOrg();
  if (!org) return null;

  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("org_id", org.id)
    .single();

  if (!client) notFound();

  return (
    <PageShell
      title={client.name}
      description={client.company || client.email || "Edit client details"}
      backHref="/clients"
      backLabel="Clients"
      breadcrumbs={[
        { label: "Clients", href: "/clients" },
        { label: client.name },
      ]}
      actions={
        <DeleteClientButton clientId={id} clientName={client.name} />
      }
    >
      <ClientForm
        clientId={id}
        cancelHref="/clients"
        defaultValues={{
          name: client.name,
          email: client.email ?? "",
          phone: client.phone ?? "",
          company: client.company ?? "",
          billingAddress: client.billing_address ?? "",
          gstin: client.gstin ?? "",
          stateCode: client.state_code,
          notes: client.notes ?? "",
        }}
      />
    </PageShell>
  );
}
