import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

export type QuotationLineItem = {
  id: string;
  description: string;
  model: string;
  quantity: number;
  unitPrice: number;
};

export type QuotationDiscountType = "percent" | "fixed";

export type QuotationDraft = {
  quoteNumber: string;
  date: string;
  attn: string;
  company: string;
  location: string;
  items: QuotationLineItem[];
  discountType: QuotationDiscountType;
  discountValue: number;
  notes: string;
};

export type QuotationSavePayload = QuotationDraft & {
  subtotal: number;
  discountAmount: number;
  total: number;
};

const COMPANY_INFO_KEY = "eyetech-quotation-company";
const DRAFTS_KEY = "eyetech-quotation-drafts";

type CompanyInfo = {
  name: string;
  tagline: string;
  phone: string;
  logoUrl: string | null;
  whatsapp: string;
  terms: string[];
};

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB

const defaultCompanyInfo: CompanyInfo = {
  name: "EYETECH ENGINEERING & SUPPLIES",
  tagline: "STEEL, ALUMINIUM & GLASS FABRICATION SOLUTIONS",
  phone: "0717 614 427 / 0759 719 147",
  logoUrl: null,
  whatsapp: "254717614427",
  terms: [
    "Validity: Prices valid for 30 days from quotation date",
    "Delivery time: 7–14 working days from order confirmation, unless stated otherwise",
    "Warranty: 12 months warranty on fittings and hardware for manufacturing defects only",
    "Installation: Technical assurance for installation within Nairobi and environs",
    "Payment: 60% advance payment to commence work, balance on completion",
  ],
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const emptyItem = (): QuotationLineItem => ({
  id: makeId(),
  description: "",
  model: "",
  quantity: 1,
  unitPrice: 0,
});

const todayIso = () => new Date().toISOString().slice(0, 10);

const generateQuoteNumber = () => {
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${seq}-${year}-1`;
};

const emptyDraft = (): QuotationDraft => ({
  quoteNumber: generateQuoteNumber(),
  date: todayIso(),
  attn: "",
  company: "",
  location: "",
  items: [emptyItem()],
  discountType: "percent",
  discountValue: 0,
  notes: "",
});

/** Safe to render identically on the server and before hydration — no random/date values. */
const blankDraft = (): QuotationDraft => ({
  quoteNumber: "",
  date: "",
  attn: "",
  company: "",
  location: "",
  items: [emptyItem()],
  discountType: "percent",
  discountValue: 0,
  notes: "",
});

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const loadCompanyInfo = (): CompanyInfo => {
  if (typeof window === "undefined") return defaultCompanyInfo;
  try {
    const raw = window.localStorage.getItem(COMPANY_INFO_KEY);
    if (!raw) return defaultCompanyInfo;
    return { ...defaultCompanyInfo, ...(JSON.parse(raw) as Partial<CompanyInfo>) };
  } catch {
    return defaultCompanyInfo;
  }
};

type StoredDraft = { id: string; savedAt: string; draft: QuotationDraft };

const loadDrafts = (): StoredDraft[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DRAFTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredDraft[];
  } catch {
    return [];
  }
};

export type QuotationBuilderProps = {
  /** When provided, shows a "Save to dashboard" action that persists the quotation server-side. */
  onSave?: (payload: QuotationSavePayload) => Promise<{ error?: string } | void>;
  /** Hides the local draft/history tools — useful when an outer page already manages persistence. */
  hideLocalDrafts?: boolean;
  /** Compact heading, used when embedded inside another dashboard section. */
  embedded?: boolean;
};

export function QuotationBuilder({
  onSave,
  hideLocalDrafts = false,
  embedded = false,
}: QuotationBuilderProps) {
  const [draft, setDraft] = useState<QuotationDraft>(() => blankDraft());
  const [company, setCompany] = useState<CompanyInfo>(defaultCompanyInfo);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [drafts, setDrafts] = useState<StoredDraft[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCompany(loadCompanyInfo());
    setDrafts(loadDrafts());
    setDraft(emptyDraft());
  }, []);

  const whatsappLink = useMemo(() => {
    const digits = company.whatsapp.replace(/\D/g, "");
    if (!digits) return "";
    const message = `Hi, I'd like to follow up on Quotation ${draft.quoteNumber || ""}`.trim();
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }, [company.whatsapp, draft.quoteNumber]);

  useEffect(() => {
    let cancelled = false;
    if (!whatsappLink) {
      setQrDataUrl(null);
      return;
    }
    import("qrcode")
      .then(({ default: QRCode }) => QRCode.toDataURL(whatsappLink, { margin: 1, width: 160 }))
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [whatsappLink]);

  const subtotal = useMemo(
    () => draft.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [draft.items],
  );
  const discountAmount = useMemo(() => {
    if (draft.discountValue <= 0) return 0;
    const raw =
      draft.discountType === "percent"
        ? (subtotal * draft.discountValue) / 100
        : draft.discountValue;
    return Math.min(Math.max(raw, 0), subtotal);
  }, [draft.discountType, draft.discountValue, subtotal]);
  const total = Math.max(subtotal - discountAmount, 0);

  const updateItem = (id: string, patch: Partial<QuotationLineItem>) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () =>
    setDraft((current) => ({ ...current, items: [...current.items, emptyItem()] }));

  const removeItem = (id: string) =>
    setDraft((current) => ({
      ...current,
      items:
        current.items.length > 1 ? current.items.filter((item) => item.id !== id) : current.items,
    }));

  const startNew = () => {
    setDraft(emptyDraft());
    setStatus("");
  };

  const saveDraftLocally = () => {
    const next: StoredDraft = { id: makeId(), savedAt: new Date().toISOString(), draft };
    const updated = [next, ...drafts].slice(0, 20);
    setDrafts(updated);
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    setStatus("Draft saved on this device.");
  };

  const loadDraft = (stored: StoredDraft) => {
    setDraft(stored.draft);
    setShowHistory(false);
    setStatus(`Loaded draft from ${new Date(stored.savedAt).toLocaleString()}.`);
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter((item) => item.id !== id);
    setDrafts(updated);
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  };

  const saveCompanySettings = (next: CompanyInfo) => {
    setCompany(next);
    window.localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(next));
    setShowCompanySettings(false);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setStatus("");
    const result = await onSave({ ...draft, subtotal, discountAmount, total });
    setSaving(false);
    if (result?.error) {
      setStatus(result.error);
      return;
    }
    setStatus("Quotation saved.");
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    setSavingPdf(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Quotation-${draft.quoteNumber}.pdf`);
    } finally {
      setSavingPdf(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {!embedded && <h2 className="text-2xl font-black text-navy">Quotation Builder</h2>}
          <p className="mt-1 text-sm text-muted-foreground">
            Build a branded quotation, preview it live and export it to PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!hideLocalDrafts && (
            <>
              <button
                type="button"
                onClick={() => setShowHistory((open) => !open)}
                className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
              >
                History ({drafts.length})
              </button>
              <button
                type="button"
                onClick={saveDraftLocally}
                className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
              >
                Save draft
              </button>
            </>
          )}
          <button
            type="button"
            onClick={startNew}
            className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
          >
            New
          </button>
          <button
            type="button"
            onClick={() => setShowCompanySettings((open) => !open)}
            className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
          >
            Company settings
          </button>
          {onSave && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="min-h-10 bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save quotation"}
            </button>
          )}
          <button
            type="button"
            onClick={downloadPdf}
            disabled={savingPdf}
            className="min-h-10 bg-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-60"
          >
            {savingPdf ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      </div>

      {status && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 border-l-2 border-gold bg-gold/10 p-2 text-xs text-navy"
        >
          {status}
        </p>
      )}

      {showHistory && !hideLocalDrafts && (
        <div className="mt-4 border border-border bg-background p-4">
          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved drafts on this device yet.</p>
          ) : (
            <ul className="space-y-2">
              {drafts.map((stored) => (
                <li
                  key={stored.id}
                  className="flex items-center justify-between gap-3 border border-border bg-white px-3 py-2 text-sm"
                >
                  <button type="button" onClick={() => loadDraft(stored)} className="text-left">
                    <span className="block font-bold text-navy">
                      {stored.draft.quoteNumber} — {stored.draft.attn || "Unnamed"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {new Date(stored.savedAt).toLocaleString()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDraft(stored.id)}
                    className="text-xs font-bold uppercase tracking-widest text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showCompanySettings && (
        <CompanySettingsPanel
          company={company}
          onSave={saveCompanySettings}
          onCancel={() => setShowCompanySettings(false)}
        />
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5 border border-border bg-white p-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-navy">
            Quotation details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
              Quotation no.
              <input
                value={draft.quoteNumber}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, quoteNumber: event.target.value }))
                }
                className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, date: event.target.value }))
                }
                className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
              Attn
              <input
                value={draft.attn}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, attn: event.target.value }))
                }
                placeholder="Customer name"
                className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
              Company
              <input
                value={draft.company}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, company: event.target.value }))
                }
                placeholder="Customer's company (optional)"
                className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy sm:col-span-2">
              Location
              <input
                value={draft.location}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, location: event.target.value }))
                }
                placeholder="e.g. Nairobi"
                className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-navy">Line items</h4>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold uppercase tracking-widest text-navy underline"
              >
                + Add item
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {draft.items.map((item, index) => (
                <div key={item.id} className="border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Item {index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={draft.items.length === 1}
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-bold uppercase tracking-widest text-red-700 disabled:opacity-30"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-[1.6fr_0.9fr_0.5fr_0.8fr]">
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-widest text-navy">
                      Description
                      <input
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, { description: event.target.value })
                        }
                        className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
                      />
                    </label>
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-widest text-navy">
                      Model
                      <input
                        value={item.model}
                        onChange={(event) => updateItem(item.id, { model: event.target.value })}
                        className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
                      />
                    </label>
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-widest text-navy">
                      Qty
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.id, { quantity: Number(event.target.value) || 1 })
                        }
                        className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
                      />
                    </label>
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-widest text-navy">
                      Unit price
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })
                        }
                        className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-navy">Totals</h4>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
                Discount type
                <select
                  value={draft.discountType}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      discountType: event.target.value as QuotationDiscountType,
                    }))
                  }
                  className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
                {draft.discountType === "percent" ? "Discount %" : "Discount (KES)"}
                <input
                  type="number"
                  min="0"
                  value={draft.discountValue}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      discountValue: Number(event.target.value) || 0,
                    }))
                  }
                  className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
                />
              </label>
            </div>
          </div>

          <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
            Notes (optional)
            <textarea
              rows={3}
              value={draft.notes}
              onChange={(event) =>
                setDraft((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Extra notes to print on the quotation"
              className="border border-border bg-background px-3 py-2 font-normal normal-case tracking-normal"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Live preview
          </p>
          <div ref={previewRef} className="border border-border bg-white p-8 text-navy">
            <div className="text-center">
              {company.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="mx-auto mb-3 h-16 max-w-[220px] object-contain"
                  crossOrigin="anonymous"
                />
              )}
              <h2 className="text-lg font-black tracking-wide">{company.name}</h2>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {company.tagline}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">MOBILE: {company.phone}</p>
            </div>
            <div className="mt-6 grid gap-1 text-xs">
              <p>
                <span className="font-bold">ATTN:</span> {draft.attn || "—"}
              </p>
              <p>
                <span className="font-bold">COMPANY:</span> {draft.company || "—"}
              </p>
              <p>
                <span className="font-bold">LOCATION:</span> {draft.location || "—"}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-y border-navy py-2 text-xs font-bold">
              <span>QUOTATION</span>
              <span>Q.NO: {draft.quoteNumber}</span>
              <span>DATE: {draft.date}</span>
            </div>
            <table className="mt-4 w-full border-collapse text-xs">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="border border-navy px-2 py-1.5 text-left">S.NO</th>
                  <th className="border border-navy px-2 py-1.5 text-left">DESCRIPTION</th>
                  <th className="border border-navy px-2 py-1.5 text-left">MODEL</th>
                  <th className="border border-navy px-2 py-1.5 text-right">QTY</th>
                  <th className="border border-navy px-2 py-1.5 text-right">UNIT PRICE</th>
                  <th className="border border-navy px-2 py-1.5 text-right">TOTAL PRICE</th>
                </tr>
              </thead>
              <tbody>
                {draft.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-border px-2 py-1.5">{index + 1}</td>
                    <td className="border border-border px-2 py-1.5">{item.description || "—"}</td>
                    <td className="border border-border px-2 py-1.5">{item.model || "—"}</td>
                    <td className="border border-border px-2 py-1.5 text-right">{item.quantity}</td>
                    <td className="border border-border px-2 py-1.5 text-right">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-border px-2 py-1.5 text-right">
                      {(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 ml-auto max-w-xs space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Discount ({draft.discountType === "percent" ? `${draft.discountValue}%` : "fixed"}
                  )
                </span>
                <span>- {formatMoney(discountAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-navy pt-1 text-sm font-black">
                <span>GRAND TOTAL</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            {draft.notes.trim() && (
              <div className="mt-4 border-l-2 border-gold pl-3 text-xs leading-relaxed">
                {draft.notes}
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">
                  General terms of sale
                </h3>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] leading-relaxed">
                  {company.terms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ol>
              </div>
              {qrDataUrl && (
                <div className="shrink-0 text-center">
                  <img src={qrDataUrl} alt="WhatsApp follow-up QR code" className="h-24 w-24" />
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Scan to WhatsApp us
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanySettingsPanel({
  company,
  onSave,
  onCancel,
}: {
  company: CompanyInfo;
  onSave: (next: CompanyInfo) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(company.name);
  const [tagline, setTagline] = useState(company.tagline);
  const [phone, setPhone] = useState(company.phone);
  const [whatsapp, setWhatsapp] = useState(company.whatsapp);
  const [logoUrl, setLogoUrl] = useState(company.logoUrl);
  const [logoError, setLogoError] = useState("");
  const [terms, setTerms] = useState(company.terms.join("\n"));

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setLogoError("");
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be 1 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setLogoError("Could not read that image file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 border border-gold/60 bg-gold/5 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest text-navy">Company settings</h3>
      <div className="mt-3 grid gap-3">
        <div className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          Logo
          <div className="flex flex-wrap items-center gap-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Company logo preview"
                className="h-12 w-auto max-w-[160px] border border-border bg-white object-contain p-1"
              />
            )}
            <label className="min-h-10 cursor-pointer border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal text-navy">
              {logoUrl ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl(null)}
                className="min-h-10 border border-border px-3 py-2 font-normal normal-case tracking-normal text-navy"
              >
                Remove
              </button>
            )}
          </div>
          {logoError && (
            <p className="font-normal normal-case tracking-normal text-red-600">{logoError}</p>
          )}
          <p className="font-normal normal-case tracking-normal text-muted-foreground">
            PNG, JPG, SVG or WebP, up to 1 MB. Shown at the top of the quotation and PDF.
          </p>
        </div>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          Business name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          Tagline
          <input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          WhatsApp number for QR code
          <input
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="2547XXXXXXXX"
            className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
          />
          <p className="font-normal normal-case tracking-normal text-muted-foreground">
            Country code + number, no spaces or "+". Clients scan the QR code on the quotation to
            message you on WhatsApp about this quote.
          </p>
        </label>
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-widest text-navy">
          General terms of sale (one per line)
          <textarea
            rows={5}
            value={terms}
            onChange={(event) => setTerms(event.target.value)}
            className="border border-border bg-white px-3 py-2 font-normal normal-case tracking-normal"
          />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() =>
            onSave({
              name: name.trim() || defaultCompanyInfo.name,
              tagline: tagline.trim() || defaultCompanyInfo.tagline,
              phone: phone.trim() || defaultCompanyInfo.phone,
              logoUrl,
              whatsapp: whatsapp.replace(/\D/g, "") || defaultCompanyInfo.whatsapp,
              terms: terms
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          }
          className="min-h-10 bg-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
        >
          Save settings
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
