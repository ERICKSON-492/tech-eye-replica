import { useState, type FormEvent } from "react";
import { services } from "@/lib/services";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const WHATSAPP = "https://wa.me/254717614427";

type QuoteFormProps = {
  initialService?: string;
  compact?: boolean;
};

type QuoteDraft = {
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  projectType: string;
  timeline: string;
  message: string;
};

const emptyDraft: QuoteDraft = {
  name: "",
  phone: "",
  email: "",
  service: "",
  location: "",
  projectType: "",
  timeline: "",
  message: "",
};

export function QuoteForm({ initialService = "", compact = false }: QuoteFormProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<QuoteDraft>({ ...emptyDraft, service: initialService });

  const syncDraft = (form: HTMLFormElement) => {
    const data = new FormData(form);
    setDraft({
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      service: String(data.get("service") || ""),
      location: String(data.get("location") || ""),
      projectType: String(data.get("projectType") || ""),
      timeline: String(data.get("timeline") || ""),
      message: String(data.get("message") || ""),
    });
  };

  const previewRows: [string, string][] = [
    ["Name", draft.name],
    ["Phone", draft.phone],
    ["Email", draft.email],
    ["Service", draft.service],
    ["Location", draft.location],
    ["Project type", draft.projectType],
    ["Timeline", draft.timeline],
  ];
  const filledCount =
    previewRows.filter(([, value]) => value.trim()).length + (draft.message.trim() ? 1 : 0);
  const completion = Math.round((filledCount / 8) * 100);

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
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

    setError("");
    setSubmitting(true);
    if (isSupabaseConfigured) {
      const { error: requestError } = await supabase.from("quotation_requests").insert({
        customer_name: String(data.get("name") || ""),
        customer_email: String(data.get("email") || ""),
        customer_phone: String(data.get("phone") || ""),
        service: String(data.get("service") || ""),
        project_location: String(data.get("location") || ""),
        project_type: String(data.get("projectType") || ""),
        timeline: String(data.get("timeline") || ""),
        details: String(data.get("message") || ""),
      });
      if (requestError) {
        setSubmitting(false);
        setError(requestError.message);
        return;
      }
    } else {
      window.open(
        `${WHATSAPP}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }

    setSubmitting(false);
    setSent(true);
    form.reset();
    setDraft({ ...emptyDraft, service: initialService });
  };

  return (
    <form
      className={`motion-section border border-border bg-surface ${compact ? "p-6" : "p-6 sm:p-8"}`}
      onSubmit={submitQuote}
      onChange={(event) => syncDraft(event.currentTarget)}
      onInput={(event) => syncDraft(event.currentTarget)}
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
            htmlFor="quote-email"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy"
          >
            Email
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
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
          disabled={submitting}
          className="motion-link w-full bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Submitting request…" : "Submit quotation request →"}
        </button>
        {error && (
          <p role="alert" className="border-l-2 border-red-600 bg-red-50 p-3 text-sm text-red-900">
            {error}
          </p>
        )}
        {sent && (
          <p
            role="status"
            aria-live="polite"
            className="motion-card border border-gold/50 bg-gold/10 p-3 text-sm text-navy"
          >
            {isSupabaseConfigured
              ? "Your quotation request has been submitted. Our team will review it and contact you shortly."
              : "Your WhatsApp message has been prepared. We look forward to discussing your project."}
          </p>
        )}
        <div className="border border-border bg-white p-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-navy">
              Live request preview
            </h3>
            <span className="text-xs font-bold text-gold">{completion}% complete</span>
          </div>
          <div className="mt-3 h-1 w-full bg-border">
            <div className="h-1 bg-gold transition-all" style={{ width: `${completion}%` }} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {previewRows.map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-32 shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
                <dd className={value.trim() ? "text-navy" : "text-muted-foreground/60"}>
                  {value.trim() || "—"}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 whitespace-pre-wrap border-l-2 border-gold pl-3 text-sm leading-relaxed text-navy">
            {draft.message.trim() || (
              <span className="text-muted-foreground/60">
                Your project description will appear here as you type.
              </span>
            )}
          </p>
        </div>
      </div>
    </form>
  );
}
