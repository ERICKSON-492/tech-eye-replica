import { createFileRoute } from "@tanstack/react-router";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { QuotationBuilder } from "@/components/quotation-builder";

export const Route = createFileRoute("/quotation-builder")({
  component: QuotationBuilderPage,
  head: () => ({
    meta: [
      { title: "Quotation Builder | Eyetech Engineering & Supplies" },
      {
        name: "description",
        content:
          "Build professional quotations, preview them live and export them to PDF for Eyetech Engineering & Supplies customers.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function QuotationBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-4 py-10">
        <QuotationBuilder />
      </main>
      <Footer />
    </div>
  );
}
