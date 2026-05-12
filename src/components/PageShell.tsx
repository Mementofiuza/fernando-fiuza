import { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-32 pb-20">
      <section className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl reveal">
          {eyebrow && (
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.05]">
            {title}
          </h1>
          <div className="gold-rule-left mt-6" />
          {intro && (
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {intro}
            </p>
          )}
        </div>

        <div className="mt-16">{children}</div>
      </section>
    </div>
  );
}
