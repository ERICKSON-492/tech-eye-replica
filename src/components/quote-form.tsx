import { useState } from "react";
import { services } from "@/lib/services";

const WHATSAPP = "https://wa.me/254717614427";

type QuoteFormProps = {
  initialService?: string;
  compact?: boolean;
};

export function QuoteForm({ initialService = "", compact = false }: QuoteFormProps) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className={`motion-section border border-border bg-surface ${compact ? "p-6" : "p-6 sm:p-8"}`}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const message = [
          `Hello Eyetech, I'm ${data.get("name")} (${data.get("phone")}).`,
          `Service: ${data.get("service") || "Not specified"}.`,
          `Project location: ${data.get("location") || "Not specified"}.`,
          `Project type: ${data.get("projectType") || "Not specified"}.`,
          `Timeline: ${data.get("timeline") || "Not specified"}.`,
          `Details: ${data.get("message")}`,
        ].join(" ");
        window.open(
          `${WHATSAPP}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer",
        );
        setSent(true);
        form.reset();
      }}
    >
      <h2 className="text-lg font-bold text-navy">Request a Quote</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Share a few project details and we will help you plan the next step.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="quote-name"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Full name{" "}
            <span className="text-gold" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="quote-name"
            name="name"
            required
            autoComplete="name"
            className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label
            htmlFor="quote-phone"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Phone / WhatsApp number{" "}
            <span className="text-gold" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="quote-phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label
            htmlFor="quote-service"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Service
          </label>
          <select
            id="quote-service"
            name="service"
            defaultValue={initialService}
            className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quote-location"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
            >
              Project location
            </label>
            <input
              id="quote-location"
              name="location"
              autoComplete="address-level2"
              placeholder="e.g. Nairobi"
              className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <div>
            <label
              htmlFor="quote-type"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
            >
              Project type
            </label>
            <select
              id="quote-type"
              name="projectType"
              defaultValue=""
              className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
            >
              <option value="">Select type</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Institutional</option>
              <option>Architectural / contractor</option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="quote-timeline"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Preferred timeline
          </label>
          <input
            id="quote-timeline"
            name="timeline"
            placeholder="e.g. Within 4–6 weeks"
            className="w-full border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label
            htmlFor="quote-message"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Tell us about your project{" "}
            <span className="text-gold" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="quote-message"
            name="message"
            required
            rows={5}
            placeholder="Add dimensions, materials, drawings or other useful details"
            className="w-full resize-y border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <button
          type="submit"
          className="motion-link w-full bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          Send via WhatsApp →
        </button>
        {sent && (
          <p
            role="status"
            aria-live="polite"
            className="motion-card border border-gold/50 bg-gold/10 p-3 text-sm text-navy"
          >
            Your WhatsApp message has been prepared. We look forward to discussing your project.
          </p>
        )}
      </div>
    </form>
  );
}
