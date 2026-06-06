import Link from "next/link";

import { OrgMissing } from "@/components/error/org-missing";
import { EmptyState } from "@/components/empty-state";
import { DataPanel } from "@/components/layout/data-panel";
import { PageHeader } from "@/components/layout/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const { org } = await getCurrentOrg();
  if (!org) return <OrgMissing />;

  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, company, phone, email")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="Manage your client database"
        action={{ label: "Add client", href: "/clients/new" }}
      />

      {!clients?.length ? (
        <EmptyState
          title="No clients yet"
          description="Add your first client to start creating quotations and invoices."
          actionLabel="Add your first client"
          actionHref="/clients/new"
        />
      ) : (
        <DataPanel className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id} className="border-border/40">
                  <TableCell>
                    <Link
                      href={`/clients/${c.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.company ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.email ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataPanel>
      )}
    </div>
  );
}
