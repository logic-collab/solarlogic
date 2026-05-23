"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  BookOpen,
  ChevronRight,
  CircleAlert,
  Cpu,
  MapPinned,
  Menu,
  MoonStar,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import AskSolarLogic from "../components/AskSolarLogic";

type StateDatum = {
  code: string;
  name: string;
  region: string;
  payback: number;
  netMetering: string;
  verdict: string;
  rate: string;
  viability: number;
};

type MarketPoint = {
  label: string;
  value: string;
  direction?: "up" | "down" | "neutral";
};

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const states: StateDatum[] = [
  {
    code: "CA",
    name: "California",
    region: "West",
    payback: 8.1,
    netMetering: "NEM 3.0",
    verdict: "BUY SOLAR + BATTERY",
    rate: "$0.34/kWh",
    viability: 5,
  },
  {
    code: "TX",
    name: "Texas",
    region: "South",
    payback: 7.5,
    netMetering: "Retail Credit Mixed",
    verdict: "BUY IF LOAD IS HIGH",
    rate: "$0.17/kWh",
    viability: 4,
  },
  {
    code: "AZ",
    name: "Arizona",
    region: "Southwest",
    payback: 7.2,
    netMetering: "Export Rates Weak",
    verdict: "BUY BATTERY",
    rate: "$0.16/kWh",
    viability: 4,
  },
  {
    code: "FL",
    name: "Florida",
    region: "Southeast",
    payback: 10.4,
    netMetering: "1:1 Credit",
    verdict: "SOLAR STRONG, BATTERY OPTIONAL",
    rate: "$0.15/kWh",
    viability: 4,
  },
  {
    code: "NY",
    name: "New York",
    region: "Northeast",
    payback: 9.8,
    netMetering: "VDER Complex",
    verdict: "MODEL CAREFULLY",
    rate: "$0.25/kWh",
    viability: 3,
  },
  {
    code: "NJ",
    name: "New Jersey",
    region: "Northeast",
    payback: 7.9,
    netMetering: "Strong",
    verdict: "BUY SOLAR",
    rate: "$0.21/kWh",
    viability: 5,
  },
];

const marketTicker: MarketPoint[] = [
  { label: "AVG SOLAR COST (CA)", value: "$2.85/W", direction: "down" },
  { label: "TESLA POWERWALL PRICE", value: "$15,000", direction: "up" },
  { label: "NEM 3.0 STATUS", value: "ACTIVE", direction: "neutral" },
  { label: "CURRENT FED TAX CREDIT", value: "30%", direction: "neutral" },
  { label: "BATTERY PAYBACK", value: "9.2 YRS", direction: "down" },
  { label: "SCAM ALERT LEVEL", value: "HIGH", direction: "up" },
];

const contractCards = [
  {
    title: "The 30% Dealer Fee",
    stat: "+$8,000 hidden",
    copy: "The financed price quietly explodes while the cash quote never appears on page one.",
  },
  {
    title: "The \u2018Estimated\u2019 Production Clause",
    stat: "Zero output guarantee",
    copy: "Installers promise savings with language that protects them if the system underperforms.",
  },
  {
    title: "The Escalator Rate Trap",
    stat: "+2.9% every year",
    copy: "A low monthly payment turns expensive when the agreement compounds faster than utility inflation.",
  },
];

const packs = [
  {
    badge: "BEST SELLER",
    title: "Solar Decision-Maker\u2019s Toolkit",
    price: "$79",
    strike: "$1,000+ Value",
    features: ["ROI calculator", "Scam report", "Installer comparison sheet", "Battery decision matrix"],
  },
  {
    badge: "ESSENTIAL",
    title: "Home EV Charging Blueprint",
    price: "$49",
    strike: "Engineer-grade guidance",
    features: ["Panel capacity guide", "TOU savings model", "Charger selector", "Permit checklist"],
  },
  {
    badge: "QUICK START",
    title: "Quote Sanity Check",
    price: "$19",
    strike: "Fastest way to verify a proposal",
    features: ["Dealer fee formula", "Offset audit", "Cash vs finance analysis", "Red-flag checklist"],
  },
];

const researchItems = [
  {
    tag: "SCAM ALERT",
    title: "Why Dealer Fees Break the Economics of \u20180% APR\u2019 Solar",
    summary: "A briefing on financed pricing, prepaid finance charges, and how to compare to true cash cost.",
  },
  {
    tag: "MARKET ANALYSIS",
    title: "Battery ROI Under NEM 3.0: When Backup Starts Printing Money",
    summary: "Load shifting, evening arbitrage, and the breakeven conditions most quotes ignore.",
  },
  {
    tag: "TECH REVIEW",
    title: "Top Rated Equipment 2026: Inverters, Batteries, and Charger Picks",
    summary: "The shortlist of gear we would install if it were our own house and our own money.",
  },
];

const glossary = ["Dealer Fee", "PPA", "True-Up", "NEM 3.0", "Offset", "Main Panel Upgrade"];

const testimonials = [
  {
    source: "YouTube Comment",
    quote: "I caught a $5,600 dealer fee before signing. This paid for itself in 10 minutes.",
  },
  {
    source: "Email",
    quote: "Your battery analysis kept us from over-sizing the system. Saved us almost $4k.",
  },
  {
    source: "Tweet",
    quote: "This felt like having a Palantir dashboard for my utility bill. Brutal clarity.",
  },
  {
    source: "DM",
    quote: "Installer said 115% offset was normal. Your checklist told me exactly why it was nonsense.",
  },
];

const houseZones = [
  {
    key: "roof",
    label: "Roof",
    title: "Solar Array Guide",
    copy: "Production modeling, azimuth sanity checks, and module quality filters.",
  },
  {
    key: "garage",
    label: "Garage",
    title: "EV Charger Guide",
    copy: "Breaker sizing, load management, daily mileage, and hardware recommendations.",
  },
  {
    key: "meter",
    label: "Meter",
    title: "Panel Upgrade Guide",
    copy: "How to know when 100A service becomes the bottleneck for solar, storage, and charging.",
  },
] as const;

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: CounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function getDirectionColor(direction?: MarketPoint["direction"]) {
  if (direction === "up") return "text-[#FF3D00]";
  if (direction === "down") return "text-[#00E676]";
  return "text-main";
}

export default function SolarLogicHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [stateCode, setStateCode] = useState(() => {
    if (typeof navigator !== "undefined") {
      const language = navigator.language || "en-US";
      if (language.includes("en-US")) return "TX";
    }
    return "CA";
  });
  const [bill, setBill] = useState(240);
  const [email, setEmail] = useState("");
  const [estimatorStep, setEstimatorStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({ distance: true, panel: "200A", tou: true });
  const [activeZone, setActiveZone] = useState<(typeof houseZones)[number]["key"]>("roof");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const selectedState = useMemo(
    () => states.find((state) => state.code === stateCode) ?? states[0],
    [stateCode]
  );

  const savingsEstimate = useMemo(() => {
    const annualBill = bill * 12;
    const rateFactor = selectedState.viability * 0.06;
    return Math.round(annualBill * (0.42 + rateFactor));
  }, [bill, selectedState]);

  const chargerRecommendation = useMemo(() => {
    if (quizAnswers.distance && quizAnswers.panel === "200A" && quizAnswers.tou) {
      return "Wallbox Pulsar Plus hardwired on a 60A breaker";
    }

    if (quizAnswers.distance && quizAnswers.panel === "100A") {
      return "Tesla Universal Wall Connector with load management review";
    }

    if (!quizAnswers.distance && quizAnswers.tou) {
      return "Emporia Level 2 smart charger on a 40A circuit";
    }

    return "Grizzl-E Classic Level 2 charger on a 40A breaker";
  }, [quizAnswers]);

  const activeHouseZone = houseZones.find((zone) => zone.key === activeZone) ?? houseZones[0];

  useEffect(() => {
    document.body.classList.toggle("blueprint", blueprintMode);
    return () => document.body.classList.remove("blueprint");
  }, [blueprintMode]);

  return (
    <div className="app-shell text-main selection:bg-[#FFD700] selection:text-black">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gold-bg glow-ring transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="display-font text-sm font-bold tracking-[0.35em] text-main">SOLARLOGIC</p>
              <p className="data-text text-[10px] uppercase tracking-[0.3em] text-muted">Intelligence Terminal</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["Intelligence", "#research"],
              ["The Toolkit", "#packs"],
              ["EV Charging", "#charger"],
              ["About", "#about"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-sm font-medium text-muted transition hover:text-main">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setBlueprintMode((value) => !value)}
              className="panel flex items-center gap-2 rounded-full px-4 py-2 text-sm text-main transition hover:-translate-y-0.5"
            >
              {blueprintMode ? <MoonStar className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
              {blueprintMode ? "Dark Mode" : "Blueprint Mode"}
            </button>
            <a href="#estimator" className="rounded-full gold-bg px-5 py-3 text-sm font-extrabold tracking-wide transition hover:scale-[1.02] shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              Get Free Analysis
            </a>
          </div>

          <button
            className="panel rounded-full p-3 md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/8 px-4 py-4 md:hidden bg-black">
            <div className="flex flex-col gap-4">
              {[
                ["Intelligence", "#research"],
                ["The Toolkit", "#packs"],
                ["EV Charging", "#charger"],
                ["About", "#about"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="text-sm text-muted" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <button
                onClick={() => setBlueprintMode((value) => !value)}
                className="panel rounded-full px-4 py-3 text-left text-sm"
              >
                Toggle {blueprintMode ? "Dark" : "Blueprint"} Mode
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        {/* ─── HERO SECTION ─── */}
        <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-14 pt-10 sm:px-6 lg:flex-row lg:px-8 lg:pt-16">
          <div className="relative z-10 max-w-3xl flex-1">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="soft-badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-main border border-white/10 bg-white/5"
            >
              <Sparkles className="h-3.5 w-3.5 gold-text" />
              Independent research collective
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="display-font text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Stop Guessing on Solar and EV Decisions.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
            >
              Use data-driven tools to estimate payback, check quotes, and avoid expensive mistakes before you sign anything. Built for <span className="gold-text font-semibold">{selectedState.name}</span> homeowners.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#estimator"
                className="pulse-gold rounded-full gold-bg px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.2em] transition hover:scale-[1.02]"
              >
                Run the Free Calculator
              </a>
              <a
                href="#map"
                className="panel rounded-full px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-main transition hover:-translate-y-0.5"
              >
                Check My Quote
              </a>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Verified Savings Generated", value: 2.4, prefix: "$", suffix: "M+", decimals: 1 },
                { label: "Quotes Audited", value: 1827, suffix: "+" },
                { label: "Avg Avoided Mistake", value: 5300, prefix: "$", suffix: "+" },
              ].map((metric) => (
                <div key={metric.label} className="card-surface rounded-3xl p-5">
                  <p className="data-text text-2xl font-bold gold-text">
                    <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} decimals={metric.decimals} />
                  </p>
                  <p className="mt-2 text-sm text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative flex flex-1 items-center justify-center lg:justify-end"
          >
            <div className="floating-orb absolute -left-6 top-16 h-28 w-28 rounded-full bg-[#00E676]/10 blur-3xl" />
            <div className="floating-orb absolute -right-6 bottom-12 h-40 w-40 rounded-full bg-[#FFD700]/10 blur-3xl" />
            <div className="panel relative h-[480px] w-full max-w-[500px] overflow-hidden rounded-[2rem] p-6 border-t border-white/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-20" />
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">Live System Model</p>
                  <p className="mt-2 display-font text-2xl font-bold">Energy Stack</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 data-text text-xs text-muted flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  ONLINE
                </div>
              </div>

              <div className="relative mt-8 flex h-[360px] items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute h-72 w-72 rounded-full border border-white/5 border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute h-60 w-60 rounded-full border border-white/10"
                />

                <div className="relative z-10">
                  <div className="relative h-40 w-56 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center flex-col">
                    <div className="text-4xl font-bold gold-text">82%</div>
                    <div className="text-xs uppercase tracking-widest text-muted mt-2">Grid Independence</div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Battery State", "Discharging"],
                    ["Grid Load", "0.2 kW"],
                  ].map(([label, value]) => (
                    <div key={label} className="card-surface rounded-2xl px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
                      <p className="mt-1 data-text text-sm font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── TICKER ─── */}
        <section className="border-y border-white/8 bg-white/[0.02] py-4">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="marquee-track gap-8 pr-8">
              {[...marketTicker, ...marketTicker, ...marketTicker].map((item, index) => (
                <div key={`${item.label}-${index}`} className="data-text inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-muted">
                  <span>{item.label}</span>
                  <span className={`font-bold ${getDirectionColor(item.direction)}`}>{item.value}</span>
                  <span className="text-white/20">|</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MAP SECTION ─── */}
        <section id="map" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">Interactive ROI Map</p>
              <h2 className="mt-3 display-font text-4xl font-bold sm:text-5xl">Hover the grid. Decode your market.</h2>
              <p className="mt-4 text-lg text-muted">
                We hard-code the truth first, then connect APIs later. Start with a state. Read the economics. See the verdict.
              </p>
            </div>
            <div className="panel rounded-2xl px-4 py-3 data-text text-sm uppercase tracking-[0.2em] text-muted">
              Current target market: <span className="gold-text">{selectedState.name}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="panel relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 500 320" className="h-full w-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 28} x2="500" y2={i * 28} stroke="currentColor" />
                  ))}
                  {Array.from({ length: 18 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 28} y1="0" x2={i * 28} y2="320" stroke="currentColor" />
                  ))}
                </svg>
              </div>
              <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {states.map((state) => {
                  const active = state.code === selectedState.code;
                  return (
                    <motion.button
                      key={state.code}
                      whileHover={{ y: -6, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setStateCode(state.code)}
                      onFocus={() => setStateCode(state.code)}
                      onClick={() => setStateCode(state.code)}
                      className={`relative rounded-3xl border p-5 text-left transition ${
                        active
                          ? "border-[#FFD700]/50 bg-[#FFD700]/10 shadow-[0_0_40px_rgba(255,215,0,0.12)]"
                          : "border-white/8 bg-white/[0.02]"
                      }`}
                    >
                      <div className="mb-8 flex items-start justify-between">
                        <div>
                          <p className="data-text text-xs uppercase tracking-[0.24em] text-muted">{state.region}</p>
                          <h3 className="mt-2 display-font text-2xl font-bold">{state.code}</h3>
                        </div>
                        <MapPinned className={`h-5 w-5 ${active ? "text-[#FFD700]" : "text-muted"}`} />
                      </div>
                      <p className="text-lg font-semibold">{state.name}</p>
                      <p className="mt-2 text-sm text-muted">Avg payback {state.payback} years</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div layout className="panel rounded-[2rem] p-6">
              <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">Field Tooltip</p>
              <h3 className="mt-3 display-font text-3xl font-bold">{selectedState.name}</h3>
              <div className="mt-6 space-y-4">
                {[
                  ["Electricity Rate", selectedState.rate],
                  ["Net Metering", selectedState.netMetering],
                  ["Avg Payback", `${selectedState.payback} Years`],
                  ["Verdict", selectedState.verdict],
                ].map(([label, value]) => (
                  <div key={label} className="card-surface rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
                    <p className="mt-2 text-base font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#00E676]/20 bg-[#00E676]/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#00E676]">Solar Viability</p>
                <p className="mt-2 text-xl">{"\u2B50".repeat(selectedState.viability)}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── SCAM CONTRACTS ─── */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="panel overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">The Problem</p>
                <h2 className="mt-3 display-font text-4xl font-bold sm:text-5xl">The Industry Hides the Truth.</h2>
                <p className="mt-4 text-lg text-muted">These are real homeowner pain points disguised as &ldquo;financing options&rdquo; and &ldquo;estimated savings.&rdquo; We read the fine print so you don&apos;t have to.</p>
              </div>
              <div className="rounded-full border border-[#FF3D00]/25 bg-[#FF3D00]/10 px-4 py-2 data-text text-xs uppercase tracking-[0.25em] text-[#FF8A65]">
                Scam pattern recognition enabled
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {contractCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#0b0b0b] p-5"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,61,0,0.08),transparent_45%)]" />
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-full border border-[#FF3D00]/25 bg-[#FF3D00]/10 px-3 py-1 data-text text-xs uppercase tracking-[0.2em] text-[#FF8A65]">
                        Redacted Contract
                      </div>
                      <CircleAlert className="h-5 w-5 text-[#FF3D00]" />
                    </div>
                    <div className="mb-5 rounded-[1.4rem] border border-white/8 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_18px)] p-5">
                      <div className="space-y-3">
                        <div className="h-4 w-5/6 rounded-full bg-white/10" />
                        <div className="h-4 w-full rounded-full bg-white/6" />
                        <div className="h-4 w-4/6 rounded-full bg-white/8" />
                        <div className="mt-6 h-12 rounded-2xl border border-[#FF3D00]/30 bg-[#FF3D00]/10" />
                      </div>
                    </div>
                    <h3 className="display-font text-2xl font-bold">{card.title}</h3>
                    <p className="mt-2 data-text text-sm uppercase tracking-[0.22em] text-[#FF8A65]">{card.stat}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{card.copy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CALCULATOR & CHARGER ─── */}
        <section id="estimator" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="panel rounded-[2rem] p-6 sm:p-8">
              <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">Lead Magnet</p>
              <h2 className="mt-3 display-font text-4xl font-bold sm:text-5xl">Get Your Free 1-Minute Payback Estimate.</h2>
              <p className="mt-4 text-lg text-muted">Move through the funnel like a system check: location, bill, then unlock the report.</p>

              <div className="mt-8 flex items-center gap-3">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                        estimatorStep >= step ? "border-[#FFD700] bg-[#FFD700]/10 text-main" : "border-white/10 text-muted"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 ? <div className="h-px w-8 bg-white/10" /> : null}
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-6">
                {estimatorStep === 1 ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-main">Where do you live?</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {states.map((state) => (
                        <button
                          key={state.code}
                          onClick={() => {
                            setStateCode(state.code);
                            setEstimatorStep(2);
                          }}
                          className={`rounded-2xl border px-4 py-4 text-left transition ${
                            stateCode === state.code ? "border-[#FFD700]/45 bg-[#FFD700]/10" : "border-white/10"
                          }`}
                        >
                          <p className="data-text text-xs uppercase tracking-[0.22em] text-muted">{state.code}</p>
                          <p className="mt-1 font-semibold">{state.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {estimatorStep === 2 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-main">Monthly bill?</label>
                      <span className="data-text text-sm text-muted">${bill}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={500}
                      step={10}
                      value={bill}
                      onChange={(event) => setBill(Number(event.target.value))}
                      className="range-input"
                    />
                    <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted">
                      <span>$50</span>
                      <span>$500+</span>
                    </div>
                    <button
                      onClick={() => setEstimatorStep(3)}
                      className="mt-4 rounded-full gold-bg px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em]"
                    >
                      Continue
                    </button>
                  </div>
                ) : null}

                {estimatorStep === 3 ? (
                  <div className="space-y-4">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-sm text-muted">Projected annual savings in {selectedState.name}</p>
                      <p className="mt-2 display-font text-5xl font-bold blur-[2px] select-none">
                        ${savingsEstimate.toLocaleString()}
                      </p>
                      <p className="mt-3 text-sm text-muted">Enter your email to unlock the full report, financing warnings, and recommended system range.</p>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter email to unlock full report"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-4 text-main outline-none placeholder:text-muted focus:border-[#FFD700]/50"
                    />
                    <button className="w-full rounded-full gold-bg px-5 py-4 text-sm font-extrabold uppercase tracking-[0.18em]">
                      Calculate My Savings
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div id="charger" className="panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">EV Charger Matchmaker</p>
                  <h2 className="mt-3 display-font text-4xl font-bold">Find Your Perfect Charger.</h2>
                </div>
                <BatteryCharging className="h-8 w-8 gold-text" />
              </div>

              <div className="mt-8 grid gap-4">
                <div className="card-surface rounded-2xl p-4">
                  <p className="text-sm font-semibold">Do you drive more than 40 miles/day?</p>
                  <div className="mt-3 flex gap-3">
                    {[true, false].map((choice) => (
                      <button
                        key={String(choice)}
                        onClick={() => setQuizAnswers((current) => ({ ...current, distance: choice }))}
                        className={`rounded-full px-4 py-2 text-sm ${
                          quizAnswers.distance === choice ? "gold-bg" : "border border-white/10 text-muted"
                        }`}
                      >
                        {choice ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-surface rounded-2xl p-4">
                  <p className="text-sm font-semibold">Is your panel 100A or 200A?</p>
                  <div className="mt-3 flex gap-3">
                    {["100A", "200A"].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => setQuizAnswers((current) => ({ ...current, panel: choice }))}
                        className={`rounded-full px-4 py-2 text-sm ${
                          quizAnswers.panel === choice ? "gold-bg" : "border border-white/10 text-muted"
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-surface rounded-2xl p-4">
                  <p className="text-sm font-semibold">Do you have Time-of-Use rates?</p>
                  <div className="mt-3 flex gap-3">
                    {[true, false].map((choice) => (
                      <button
                        key={`tou-${String(choice)}`}
                        onClick={() => setQuizAnswers((current) => ({ ...current, tou: choice }))}
                        className={`rounded-full px-4 py-2 text-sm ${
                          quizAnswers.tou === choice ? "gold-bg" : "border border-white/10 text-muted"
                        }`}
                      >
                        {choice ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-[#FFD700]/20 bg-[#FFD700]/8 p-5">
                <p className="data-text text-xs uppercase tracking-[0.25em] text-muted">Recommendation</p>
                <h3 className="mt-3 display-font text-2xl font-bold">{chargerRecommendation}</h3>
                <p className="mt-3 text-sm text-muted">Includes breaker guidance, smart scheduling value, and panel constraint awareness.</p>
                <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold gold-text">
                  View affiliate-ready setup <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOUSE DIAGRAM ─── */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="panel rounded-[2rem] p-6 sm:p-8">
              <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">Interactive House</p>
              <h2 className="mt-3 display-font text-4xl font-bold">Navigate the home like a system diagram.</h2>
              <p className="mt-4 text-lg text-muted">Click the zone that matches your problem and jump straight to the correct intelligence pack.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="card-surface relative rounded-[1.75rem] p-5">
                  <svg viewBox="0 0 360 280" className="h-full w-full">
                    <path d="M45 140 L180 45 L315 140" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.25" />
                    <rect x="80" y="140" width="200" height="105" rx="16" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.25" />
                    <rect x="155" y="180" width="50" height="65" rx="12" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.2" />
                  </svg>
                  <button
                    onClick={() => setActiveZone("roof")}
                    className={`absolute left-[32%] top-[14%] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      activeZone === "roof" ? "gold-bg" : "panel"
                    }`}
                  >
                    Roof
                  </button>
                  <button
                    onClick={() => setActiveZone("garage")}
                    className={`absolute right-[14%] top-[54%] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      activeZone === "garage" ? "gold-bg" : "panel"
                    }`}
                  >
                    Garage
                  </button>
                  <button
                    onClick={() => setActiveZone("meter")}
                    className={`absolute left-[10%] top-[56%] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      activeZone === "meter" ? "gold-bg" : "panel"
                    }`}
                  >
                    Meter
                  </button>
                </div>

                <div className="card-surface rounded-[1.75rem] p-5">
                  <p className="data-text text-xs uppercase tracking-[0.2em] text-muted">Selected Zone</p>
                  <h3 className="mt-3 display-font text-2xl font-bold">{activeHouseZone.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{activeHouseZone.copy}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold gold-text">
                    Open guide <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT PACKS */}
            <div id="packs" className="panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">The Armory</p>
                  <h2 className="mt-3 display-font text-4xl font-bold">Arm Yourself With Data.</h2>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 data-text text-xs uppercase tracking-[0.2em] text-muted">
                  Intelligence Packs
                </div>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-3">
                {packs.map((pack) => (
                  <motion.div key={pack.title} whileHover={{ y: -8 }} className="card-surface rounded-[1.75rem] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 data-text text-[11px] uppercase tracking-[0.24em] text-main">
                        {pack.badge}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04]">
                        <BookOpen className="h-5 w-5 gold-text" />
                      </div>
                    </div>
                    <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/6 to-transparent p-5">
                      <div className="display-font text-lg font-bold">{pack.title}</div>
                      <div className="mt-4 text-3xl font-bold">{pack.price}</div>
                      <div className="mt-1 text-sm text-muted line-through">{pack.strike}</div>
                    </div>
                    <ul className="mt-5 space-y-3 text-sm text-muted">
                      {pack.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00E676]/10 text-[#00E676]">{"\u2713"}</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-6 w-full rounded-full gold-bg px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em]">
                      Access Pack
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── RESEARCH / INTELLIGENCE ─── */}
        <section id="research" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">Intelligence</p>
              <h2 className="mt-3 display-font text-4xl font-bold sm:text-5xl">Research that protects your wallet.</h2>
              <p className="mt-4 text-lg text-muted">
                Deep dives into the tricks, the math, and the gear — written for homeowners, not engineers.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {researchItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="card-surface rounded-[1.75rem] p-6"
              >
                <div className="mb-4 inline-flex rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 data-text text-[11px] uppercase tracking-[0.24em] text-main">
                  {item.tag}
                </div>
                <h3 className="display-font text-xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.summary}</p>
                <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold gold-text">
                  Read briefing <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── GLOSSARY OF GREED ─── */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="data-text text-xs uppercase tracking-[0.3em] text-muted">Glossary of Greed</p>
                <h2 className="mt-3 display-font text-4xl font-bold sm:text-5xl">Know the language they use against you.</h2>
                <p className="mt-4 text-lg text-muted">Every term decoded. Every trap explained. Every homeowner armed.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {glossary.map((term) => (
                <a
                  key={term}
                  href="#"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-muted transition hover:border-[#FFD700]/30 hover:bg-[#FFD700]/8 hover:text-main"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF ─── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="panel rounded-[2rem] p-6 sm:p-8">
              <p className="data-text text-xs uppercase tracking-[0.28em] text-muted">Social Proof</p>
              <h2 className="mt-3 display-font text-4xl font-bold">People don&apos;t want hype. They want numbers.</h2>
              <div className="mt-6 rounded-[1.75rem] border border-[#00E676]/20 bg-[#00E676]/8 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#00E676]">Trust Badge</p>
                <p className="mt-3 display-font text-4xl font-bold">
                  <Counter value={2.4} prefix="$" suffix=" Million+" decimals={1} />
                </p>
                <p className="mt-2 text-sm text-muted">Verified savings generated across quote audits, DIY analysis, and toolkit deployments.</p>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Independent model assumptions",
                  "No installer incentives",
                  "Research-first recommendations",
                ].map((item) => (
                  <div key={item} className="card-surface flex items-center gap-3 rounded-2xl p-4 text-sm text-muted">
                    <Shield className="h-4 w-4 gold-text" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.quote}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="card-surface rounded-[1.75rem] p-5"
                >
                  <p className="data-text text-xs uppercase tracking-[0.22em] text-muted">{testimonial.source}</p>
                  <p className="mt-4 text-lg leading-8">&ldquo;{testimonial.quote}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="panel rounded-[2rem] p-8 text-center">
            <p className="display-font text-2xl font-bold">SOLARLOGIC</p>
            <p className="mt-2 text-sm text-muted">Built for Sovereignty.</p>
            <p className="mt-4 max-w-xl mx-auto text-sm text-muted leading-7">
              We help homeowners make better solar and EV decisions using simple, defensible math. No installer incentives. No manufacturer mouthpieces. Just data.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted">
              <a href="#" className="hover:text-white transition">Methodology</a>
              <a href="#" className="hover:text-white transition">Sources</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Affiliate Disclosure</a>
            </div>
            <p className="mt-8 text-xs text-muted/50">&copy; 2026 SolarLogic. Independent Research.</p>
          </div>
        </section>
      </main>

      {/* ─── STICKY MOBILE CTA BAR ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-black/90 backdrop-blur-xl px-4 py-3 md:hidden">
        <div className="flex gap-2">
          <a
            href="#estimator"
            className="flex-1 rounded-full gold-bg py-3 text-center text-xs font-extrabold uppercase tracking-[0.15em]"
          >
            Estimate Solar
          </a>
          <a
            href="#map"
            className="flex-1 rounded-full border border-white/10 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-muted"
          >
            Check a Quote
          </a>
        </div>
      </div>

      {/* ─── EMERGENCY MODAL ─── */}
      <button
        onClick={() => setQuoteModalOpen(true)}
        className="fixed bottom-20 right-5 z-50 rounded-full border border-[#FF3D00]/35 bg-[#FF3D00] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_18px_50px_rgba(255,61,0,0.35)] transition hover:scale-[1.03] md:bottom-5"
      >
        I Have a Quote in Hand
      </button>

      {quoteModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="panel relative w-full max-w-2xl rounded-[2rem] p-6 sm:p-8"
          >
            <button onClick={() => setQuoteModalOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/10 p-2">
              <X className="h-4 w-4" />
            </button>
            <p className="data-text text-xs uppercase tracking-[0.28em] text-[#FF8A65]">Emergency Audit Mode</p>
            <h3 className="mt-3 display-font text-4xl font-bold">Do not sign until you check these 3 numbers.</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Cash Price vs Financed Price", "If the spread is massive, you are likely paying a hidden fee."],
                ["Dealer Fee %", "Back into the real fee by comparing financed and cash proposal economics."],
                ["Offset %", "Overbuilt systems can distort your payback and financing logic."],
              ].map(([title, copy]) => (
                <div key={title} className="card-surface rounded-[1.5rem] p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full gold-bg px-5 py-4 text-sm font-extrabold uppercase tracking-[0.18em]">
                Click Here ($49 Audit)
              </button>
              <button onClick={() => setQuoteModalOpen(false)} className="panel rounded-full px-5 py-4 text-sm font-semibold">
                Keep reviewing
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* ── ASK SOLARLOGIC CHATBOT ── */}
      <AskSolarLogic pageContext="home" />
    </div>
  );
}