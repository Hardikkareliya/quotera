import { revalidateTag } from "next/cache";

export function revalidateDashboard(orgId: string) {
  revalidateTag(`dashboard-${orgId}`);
}
