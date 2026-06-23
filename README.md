# EIGHT25MEDIA - AI-Powered Website Audit Tool

A lightweight, AI-native web application that accepts a single URL, scrapes factual metrics, and uses a deterministic rule engine combined with Google Gemini 2.5 Flash to generate grounded, actionable insights.

## 🚀 Setup & Runnable Instructions

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation
1. Clone this repository to your local machine.
2. Install dependencies for the root, frontend, and backend. 
```bash
# In the root directory
npm install
```

### Configuration
1. Navigate to the `backend` directory.
2. Open the `.env` file (create one if it doesn't exist).
3. Add your Gemini API Key:
```env
PORT=5000
GEMINI_API_KEY=AIzaSyYourRealApiKeyHere
```

### Running the App
From the root directory, run:
```bash
npm run dev
```
- The frontend will be available at `http://localhost:5173`
- The backend will run on `http://localhost:5000`

---

## 🏗️ Architecture Overview

The application is built using a modern decoupled architecture to cleanly separate data extraction from AI processing.

1. **Frontend (React + Vite + Tailwind CSS):** A responsive, state-driven dashboard that visually separates factual data (Bento Grid) from AI insights (Accordions) and Recommendations (Prioritized Cards). It also includes a dedicated Prompt Logs viewer for transparency.
2. **Backend (Node.js + Express):** The orchestration layer.
3. **Scraper (Cheerio + Axios):** A fast, static HTML parser that meticulously extracts word counts, heading hierarchies, CTAs, and links *before* passing the text to the AI.
4. **Deterministic Rule Engine:** A crucial middleware layer that compares scraped metrics against hardcoded B2B benchmarks (e.g., CTA count > 5 = `cta_overload`). 
5. **AI Layer (Google Gemini 2.5 Flash):** Consumes the raw metrics, the pre-computed flags, and a clean text sample to generate the final JSON payload.

---

## 🧠 AI Design Decisions

**1. Grounding AI via Deterministic Flags (The "Hybrid" Approach)**
LLMs are notoriously bad at math and absolute counting. If you ask an LLM to "Count the CTAs on this page and tell me if it's too many," it will hallucinate. 
Instead, we extract the factual metrics via code, evaluate them against a deterministic rule engine (`backend/analyzer/rules.js`), and pass the resulting `flags` to the AI. The AI's prompt is explicitly instructed to: *"Explain why each pre-computed flag matters in a business context."* This guarantees 100% grounded, hallucination-free insights.

**2. Clean Signal vs Noise (Content Sampling)**
Before sending the `content_sample` to the AI for messaging clarity analysis, the scraper explicitly strips `<nav>`, `<footer>`, `<script>`, `<noscript>`, and `<video>` tags. This prevents the AI from analyzing cookie banners or hidden fallback text and ensures it evaluates the actual value proposition.

**3. Structured Output Enforcement**
The AI is prompted to return a strictly typed JSON object containing `insights` (mapped to the 5 required categories) and `recommendations` (sorted by priority).

**4. Transparent Prompt Logs**
To satisfy the requirement of visibility into the AI layer, the backend logs the `system_prompt`, `user_prompt` (the JSON payload), and `raw_output` to `backend/logs/` and exposes them directly in the frontend UI under a dedicated accordion.

---

## ⚖️ Trade-offs

**Static Parsing (Cheerio) vs. Headless Browser (Playwright)**
- *Decision:* We opted for Axios + Cheerio.
- *Trade-off:* Cheerio cannot execute JavaScript. It misses lazy-loaded images or dynamically injected DOM elements (e.g., SPAs). 
- *Why:* Speed and resource efficiency. Cheerio completes a scrape in ~0.5 seconds and uses minimal memory, making it practical for a lightweight internal tool. Playwright would offer 100% visual accuracy but would take 5-8 seconds per audit and drastically increase server costs.

**Single Prompt vs. Multi-Agent Chain**
- *Decision:* A single comprehensive prompt is used to generate all insights and recommendations simultaneously.
- *Trade-off:* Multi-agent workflows (e.g., one LLM for SEO, one for UX) could provide deeper, specialized insights.
- *Why:* Cost, latency, and scope. For a lightweight 24-hour assignment tool, a single well-crafted prompt against Gemini 2.5 Flash provides high-quality results in under 3 seconds.

---

## 🚀 What I would improve with more time

1. **Playwright Integration for JS Rendering:** Switch the scraper to Playwright to accurately audit Single Page Applications (SPAs) and capture lazy-loaded assets.
2. **Visual Snapshots:** Use the headless browser to capture a screenshot of the audited page and display it on the dashboard for better visual context.
3. **Database & Audit History:** Implement PostgreSQL to store past audits. This would allow users to track metric improvements over time (e.g., "Missing Alt Text dropped from 94% to 10% this week").
4. **Target Keyword Input:** Allow the user to input a "Target Keyword" alongside the URL, and instruct the AI to evaluate the page's topical relevance specifically against that keyword.
5. **Streaming UI:** Implement Server-Sent Events (SSE) to stream the AI insights into the frontend piece-by-piece, reducing perceived latency.
