import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory · MEES ERP" },
      { name: "description", content: "Multi-store inventory with barcode/QR tracking, requisitions, transfers, batch and serial control." },
    ],
  }),
  component: () => (
    <ModulePage
      title="Inventory"
      description="Multi-store inventory with barcode/QR tracking, requisitions, transfers, batch and serial control."
      features={["Multi-store inventory","Material requisition","Stock transfers","Asset register","Equipment register","Barcode / QR","Batch tracking","Serial numbers","Low stock alerts","Inventory valuation"]}
    />
  ),
});
