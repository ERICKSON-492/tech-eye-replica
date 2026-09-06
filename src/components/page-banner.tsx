import type { ReactNode } from "react";

export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="motion-section relative isolate overflow-hidden bg-navy-deep py-20 sm:py-24"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5, 14, 31, 0.96), rgba(5, 14, 31, 0.72)), url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      aria-label={typeof title === "string" ? title : eyebrow}
    >
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-deep/30" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4">
        <span className="eyebrow text-gold">
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">{description}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
