# Website Audit Tool — Implementation Summary

## What We're Building

A lightweight AI-powered website audit tool for EIGHT25MEDIA that analyzes a single webpage and returns factual metrics, AI-driven insights, and prioritized recommendations.

---

## Core Philosophy

> **Your code finds the problems. The AI just explains them.**

Most audit tools pass scraped content directly to an LLM and let it generate insights from training knowledge alone. This tool takes a different approach — the AI has no role in deriving facts. A deterministic rule engine classifies the page, benchmarks the metrics, and flags violations before the AI is ever called. The AI receives only pre-computed flags as structured JSON and its sole job is to explain *why* each violation matters in business context.

The AI is a reasoning engine working on structured inputs — not a text summarizer.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Scraping | Cheerio (HTML parsing) |
| AI | Claude claude-sonnet-4-6 (Anthropic API) |
| Frontend | React + Vite |
| Deployment | Vercel (monorepo) |

---

## Architecture

```
monorepo/
├── backend/
│   ├── scraper/
│   │   └── index.js           # Cheerio extraction — pure function
│   ├── analyzer/
│   │   ├── pageClassifier.js  # Infers page type from metrics
│   │   ├── benchmarks.json    # Your data source — ground truth
│   │   ├── rules.js           # Deterministic rule engine
│   │   ├── buildPrompt.js     # Translates data → AI input
│   │   └── ai.js              # Single Claude API call
│   ├── routes/
│   │   └── audit.js           # POST /api/audit
│   └── logs/                  # Prompt logs saved per audit
└── frontend/
    └── src/
        └── components/
            ├── UrlInput.jsx
            ├── MetricsPanel.jsx
            ├── InsightsPanel.jsx
            ├── RecommendationsPanel.jsx
            └── PromptLogViewer.jsx
```

---

## The 6-Step Pipeline

### Step 1 — Scrape
Cheerio fetches the URL and extracts all raw metrics from the HTML.

**What we extract:**
- Total word count
- Heading counts (H1, H2, H3)
- CTA count (buttons + primary action links)
- Internal vs external link counts
- Total image count + images missing alt text + % missing
- Meta title and meta description
- Content sample (first 800 characters of body text)
- SPA detection flag (if word count < 50, warn user)

**Why Cheerio and not Puppeteer:**
EIGHT25MEDIA builds marketing websites — WordPress, Webflow, Framer, static Next.js. These are server-rendered by necessity (Google must crawl them for SEO). Cheerio handles 90%+ of real use cases, is lightweight, and deploys cleanly on Vercel serverless. Puppeteer is 300MB, has slow cold starts, and is incompatible with serverless. If Cheerio detects fewer than 50 words, the tool warns the user that the page may be JS-rendered.

---

### Step 2 — Rule Engine (Feature Extraction + Pre-processing + Flagging)
Entirely deterministic. Zero AI involvement.

**Page classifier** infers page type from metric patterns:
```
landing_page  →  cta_count > 2 AND word_count < 700
blog_post     →  word_count > 800 AND h2_count > 3
homepage      →  internal_links > 8
```

**Benchmark lookup** pulls thresholds from `benchmarks.json` based on page type:
```json
{
  "landing_page": {
    "word_count":   { "min": 300, "max": 600 },
    "cta_count":    { "min": 1,   "max": 2   },
    "h1_count":     { "ideal": 1              },
    "alt_text_pct": { "max": 0.1              }
  }
}
```

**Rule engine** fires flags with severity levels:
```
CRITICAL  →  h1_count = 0
HIGH      →  word_count < benchmark.min
HIGH      →  images_missing_alt / images > 0.5
MEDIUM    →  cta_count > benchmark.max
MEDIUM    →  meta_description missing or < 50 chars
LOW       →  external_links > internal_links
```

**Delta computation** shows exactly how far each metric is from its benchmark:
```
word_count: 187  →  -38% below minimum (300)
cta_count:  4    →  +100% above maximum (2)
```

---

### Step 3 — Build Prompt (Data → AI Input)
Translates all pre-computed data into a structured AI input. This is the clean boundary between your deterministic layer and the AI layer.

**System prompt contains:**
- Role definition (senior web strategist at a digital agency)
- Hard rules (every finding must cite a specific metric, no generic advice)
- 2 few-shot examples showing exact reasoning style and JSON output format

**Few-shot examples teach:**
- How to cite metrics by name and value in every sentence
- The agency tone (business impact language, not technical jargon)
- The exact JSON output schema

**User prompt contains:**
```json
{
  "url": "https://example.com",
  "page_type": "landing_page",
  "metrics": { ...all extracted metrics... },
  "benchmark_deltas": {
    "word_count": "-38% below minimum",
    "cta_count": "+100% above maximum"
  },
  "flags": [
    { "severity": "critical", "issue": "h1_missing",    "value": "h1_count: 0"    },
    { "severity": "high",     "issue": "thin_content",  "value": "word_count: 187" },
    { "severity": "high",     "issue": "alt_text_gap",  "value": "7/9 images"     }
  ],
  "content_sample": "first 800 chars of body text"
}
```

---

### Step 4 — Query
Single API call to Claude claude-sonnet-4-6 with structured JSON output enforced.

The AI has two constrained jobs:

**Job 1 — Explain flagged violations (data-driven)**
For each pre-computed flag, explain why it matters in business context. The AI cannot invent findings the rule engine did not already confirm.

**Job 2 — Assess content (reading-driven)**
From the content sample only, assess messaging clarity and UX concerns. These two categories from the PDF require actually reading the copy — metrics alone cannot detect a confusing headline or a missing value proposition.

---

### Step 5 — Response
Raw model output is saved to `/logs/` immediately before any formatting. This is the prompt log deliverable.

**Three files saved per audit:**
```
logs/
  system_prompt.txt    # exact system prompt used
  user_prompt.json     # structured input sent to model
  raw_output.json      # model response before formatting
```

---

### Step 6 — Translate (AI Output → Structured Response)
Parses the raw JSON response and maps it to the final API response shape returned to the frontend.

```json
{
  "metrics": {
    "word_count": 187,
    "h1_count": 0,
    "h2_count": 4,
    "h3_count": 2,
    "cta_count": 4,
    "internal_links": 3,
    "external_links": 9,
    "images_total": 9,
    "images_missing_alt": 7,
    "images_missing_alt_pct": "78%",
    "meta_title": "Home | Acme Co",
    "meta_description": null
  },
  "page_type": "landing_page",
  "flags": [ ...rule engine output... ],
  "insights": {
    "seo_structure":    "grounded finding citing h1_count: 0...",
    "messaging_clarity":"grounded finding from content sample...",
    "cta_usage":        "grounded finding citing cta_count: 4...",
    "content_depth":    "grounded finding citing word_count: 187...",
    "ux_concerns":      "grounded finding from content + metrics..."
  },
  "recommendations": [
    {
      "priority": 1,
      "action":  "Add a single H1 containing your primary keyword",
      "reason":  "No H1 means Google has no anchor for page topic",
      "metric":  "h1_count: 0"
    }
  ],
  "prompt_logs": {
    "system_prompt": "...",
    "user_prompt":   "...",
    "raw_output":    "..."
  }
}
```

---

## AI Design Decisions

### Why few-shot prompting
Two examples are included in the system prompt showing different metric profiles and their correct analysis. This teaches the model the agency tone, citation style, and JSON structure simultaneously — without needing to describe these qualities in abstract rules.

### Why the AI never generates numbers
Scores, counts, percentages, and severity levels are all computed by the rule engine. The AI receives these as facts and explains them. This makes every AI output directly traceable and eliminates hallucination risk on quantitative claims.

### Why content sample is capped at 800 chars
Enough for the AI to assess messaging clarity and value proposition. Sending the full page text would increase token cost, dilute focus, and risk the AI straying from its constrained job.

### Why a single API call
One well-structured call with a strong system prompt outperforms multiple chained calls for this use case. It keeps latency low, prompt logs simple, and the reasoning contained.

---

## Data Flow Summary

```
URL
 │
 ▼
[Scraper]          →  raw metrics + content sample
 │
 ▼
[Page Classifier]  →  page type (landing / blog / homepage)
 │
 ▼
[Benchmark Lookup] →  thresholds from benchmarks.json
 │
 ▼
[Rule Engine]      →  flags with severity + benchmark deltas
 │
 ▼
[Prompt Builder]   →  system prompt + structured user prompt
 │
 ▼
[Claude API]       →  insights + recommendations (JSON)
 │
 ▼
[Log Writer]       →  saves system prompt, user prompt, raw output
 │
 ▼
[Translator]       →  final response { metrics, flags, insights, recommendations }
 │
 ▼
Frontend           →  Metrics Panel | Insights Panel | Recommendations
```

---

## Key Trade-offs

| Decision | Choice | Reason |
|---|---|---|
| Scraper | Cheerio over Puppeteer | Fits the marketing site use case, deploys on Vercel serverless |
| AI model | Single call over chained calls | Lower latency, simpler logs, contained reasoning |
| Scoring | No scores | PDF never asked for scores — removed to avoid padding output |
| Content sample | 800 chars | Enough for messaging assessment, minimal token cost |
| Benchmarks | Local JSON file | Owned data source, deterministic, easy to update |

---

## What I Would Improve With More Time

- **Puppeteer fallback** for JS-rendered pages when Cheerio word count is below threshold
- **Expanded benchmarks** covering more page types (product page, pricing, about)
- **Audit history** — store past audits per domain to track improvements over time
- **Competitive context** — compare metrics against known high-performing pages in the same category
- **Streaming response** — stream AI output token-by-token for better perceived performance

