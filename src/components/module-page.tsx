import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { PageShell, PageHeader, ModulePlaceholder } from "@/components/page-shell";

export function ModulePage({
  title,
  description,
  features,
  children,
}: {
  title: string;
  description: string;
  features: string[];
  children?: ReactNode;
}) {
  return (
    <>
      <AppHeader title={title} crumbs={[{ label: title }]} />
      <PageShell>
        <PageHeader title={title} description={description} />
        {children ?? <ModulePlaceholder title={title} description={description} features={features} />}
      </PageShell>
    </>
  );
}
