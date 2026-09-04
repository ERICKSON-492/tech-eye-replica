import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePage } from "@/components/service-page";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  component: ServiceDetail,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} | Eyetech Engineering & Supplies` },
      {
        name: "description",
        content:
          loaderData?.description ??
          "Explore Eyetech Engineering & Supplies fabrication and installation services in Kenya.",
      },
      {
        property: "og:title",
        content: `${loaderData?.title ?? "Service"} | Eyetech Engineering & Supplies`,
      },
      {
        property: "og:description",
        content: loaderData?.description ?? "Explore Eyetech Engineering & Supplies services.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `/services/${loaderData?.slug ?? ""}` }],
  }),
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  return <ServicePage service={service} />;
}
