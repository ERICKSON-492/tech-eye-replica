import { createFileRoute } from "@tanstack/react-router";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { QuotationBuilder } from "@/components/quotation-builder";

export const Route = createFileRoute("/quotation-builder")({
  component: QuotationBuilderPage,
  head: () => ({
    meta: [
      { title: "Quotation Builder | Eyetech Stainless Steel Expert" },
      {
        name: "description",
        content:
          "Build professional quotations, preview them live and export them to PDF for Eyetech Stainless Steel Expert customers.",
      },
      { property: "og:title", content: "Quotation Builder | Eyetech Stainless Steel Expert" },
      {
        property: "og:description",
        content: "Build and preview a branded Eyetech Stainless Steel Expert quotation.",
      },
      { property: "og:image", content: "https://eyetechstainlesssteelexpert.co.ke/eyetech-logo-512.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
