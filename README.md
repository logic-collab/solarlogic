# SolarLogic — EV & Solar Intelligence Platform

> Production-grade interactive web application for homeowners navigating EV charging and solar energy decisions.

**Stack:** Next.js 16.1.6 · TypeScript · React 19 · Tailwind CSS v4 · Framer Motion · Groq AI

**Status:** Live at `solarlogic.thelogicforge.org`

---

## Overview

SolarLogic is not a brochure site. It's a full-stack interactive platform that helps homeowners make smarter energy decisions — with real engineering calculators, forensic quote analysis, and AI-powered guidance.

Built for the 10,000+ viewers who've already found the SolarLogic YouTube channel through organic search, and the thousands more searching for honest EV and solar information every month.

---

## Key Features

### 🧮 NEC 220.83 Load Calculator
Real electrical engineering. Calculates whether your home's panel can handle a Level 2 EV charger based on the National Electrical Code — no guesswork, no electrician-upsell bias.

### 🔍 Multi-Quote Forensic Scorer
Analyzes solar/EV install quotes, flags padded line items, hidden fees, and inflated pricing. Builds a trust score for each quote.

### 🇺🇸 Interactive US ROI Map
State-by-state solar payback visualization using real utility rates, insolation data, and local incentive structures.

### 🔌 EV Charger Matchmaker
Guided quiz that matches homeowners to the right charger (Wallbox, ChargePoint, JuiceBox, Tesla, Emporia) based on driving habits and panel capacity.

### 🤖 AskSolarLogic — AI Chatbot
Groq-powered contextual chatbot answering questions about EV charging, solar quotes, installation, and incentives. Context-aware across pages.

### 📊 Savings Visualization
Recharts-powered charts showing 5/10/20-year cost comparisons between gas, hybrid, and EV ownership.

### 📋 PDF Blueprint Generator
Downloadable homeowner blueprint with permit-ready language, equipment specs, and installer briefing notes.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.1.6 |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Animation | Framer Motion 11 |
| AI | Groq SDK |
| Icons | Lucide React |
| Deployment | Netlify |

---

## Getting Started

```bash
git clone https://github.com/logic-collab/solarlogic.git
cd solarlogic
npm install
# Add GROQ_API_KEY to .env.local
npm run dev
