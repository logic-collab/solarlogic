import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

// ─── Shared shell for /privacy, /terms, /affiliate-disclosure ───
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell text-main min-h-screen selection:bg-[#FFD700] selection:text-black">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gold-bg glow-ring transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="display-font text-sm font-bold tracking-[0.35em] text-main">SOLARLOGIC</p>
              <p className="data-text text-[10px] uppercase tracking-[0.3em] text-muted">Intelligence Terminal</p>
            </div>
          </Link>
          <Link
            href="/"
            className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-main transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="panel rounded-[2rem] p-6 sm:p-10">
          <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">Legal</p>
          <h1 className="mt-3 display-font text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-4 data-text text-xs uppercase tracking-[0.2em] text-muted">
            Last updated: {updated}
          </p>
          {intro ? <p className="mt-6 text-[15px] leading-7 text-slate-300">{intro}</p> : null}

          <div className="mt-8 space-y-8">{children}</div>
        </div>

        <LegalFooter />
      </main>
    </div>
  );
}

// ─── Typography helpers (guaranteed-readable colors) ───
export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="display-font text-xl font-bold text-white sm:text-2xl">{heading}</h2>
      <div className="space-y-3 text-[15px] leading-7 text-slate-300">{children}</div>
    </section>
  );
}

export function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-slate-300 ${className}`}>{children}</p>;
}

export function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-2 text-slate-300 marker:text-[#FFD700]/60">{children}</ul>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/[0.06] p-4 text-[15px] leading-7 text-slate-200">
      {children}
    </div>
  );
}

// ─── Footer with working cross-links ───
function LegalFooter() {
  const links: [string, string][] = [
    ["Home", "/"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
    ["Affiliate Disclosure", "/affiliate-disclosure"],
  ];
  return (
    <div className="mt-8 rounded-[2rem] panel p-6 text-center">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-white">
            {label}
          </Link>
        ))}
        <a href="mailto:thelogicforge@gmail.com" className="transition hover:text-white">
          Contact
        </a>
      </div>
      <p className="mt-5 text-xs text-muted/50">&copy; 2026 SolarLogic. Independent Research.</p>
    </div>
  );
}
