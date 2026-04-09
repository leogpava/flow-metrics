# FlowMetrics

FlowMetrics is a wellness SaaS built with Next.js that combines a guided public health assessment with an authenticated admin analytics dashboard. Users complete a short onboarding flow, receive calculated wellness metrics and a personalized insight, and can trigger a report delivery flow while admins monitor acquisition, health, demographic, engagement, and session-level data from Supabase.

## Overview

### Public flow

- Landing page optimized for a fast, low-friction entry point
- Multi-step onboarding for name, sex, age, weight, height, and activity level
- Real-time calculation of BMI, wellness score, basal metabolic rate, total daily energy expenditure, hydration target, and BMI percentile context
- Personalized health insight generated through the internal insight API, with a local fallback message when AI is unavailable
- Result screen with score visualization and metric breakdown
- Report delivery flow with email persistence, confirmation screen, share CTA, and NPS capture

### Admin dashboard

- Supabase Auth login for admin access
- Executive overview with KPI cards, score trend, BMI distribution, activity distribution, and conversion-style metrics
- Dedicated analytics areas for health, demographics, engagement/NPS, and paginated session inspection
- Date-range filtering across dashboard views
- Protected server routes that validate the current admin bearer token before returning analytics data

## Tech Stack

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand for client-side flow state persistence
- Supabase for Auth and data storage
- Recharts for admin analytics visualizations
- Resend for email delivery
- Groq-compatible chat completion API for personalized insight generation

## Project Structure

```text
app/
  landing/                  Public entry page
  flow/                     End-user onboarding, results, email, confirmation
  admin/                    Admin login and dashboard routes
  api/                      Session, admin analytics, insight, and email endpoints
components/
  layout/                   Shared branding and background components
  ui/                       Reusable public-flow UI building blocks
features/
  flow/                     Flow store, calculations, email template, API clients
  admin/                    Dashboard components, types, auth helpers, analytics services
lib/
  supabase/                 Browser/server Supabase client factories
types/                      Shared domain types
public/                     Static assets
```

## How It Works

1. Users enter the public flow from `/landing` and complete a five-step wellness questionnaire.
2. The client computes core metrics locally, requests a personalized insight from `/api/insight`, and persists the completed session through `/api/sessions`.
3. The result screen presents the calculated score and supporting health indicators.
4. The report flow stores the email, triggers `/api/enviar-relatorio`, and records post-send engagement such as NPS.
5. Admin users sign in through Supabase Auth and consume protected analytics endpoints under `/api/admin/*`.
6. Admin services aggregate records from the `sessions` table into dashboard-ready KPIs, charts, distributions, and paginated tables.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public Supabase project URL used by the browser client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anonymous key for client-side Supabase Auth and requests |
| `SUPABASE_URL` | Recommended | Server-side Supabase URL fallback |
| `SUPABASE_ANON_KEY` | Optional | Server-side fallback key when a service role is not provided |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server-side key used by API routes and admin data aggregation |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL used in share text and local links |
| `GROQ_API_KEY` | Optional | Enables AI-generated personalized insights |
| `GROQ_MODEL` | Optional | Overrides the default model used by `/api/insight` |
| `RESEND_API_KEY` | Optional | Enables report email delivery through Resend |
| `RESEND_FROM_EMAIL` | Optional | Sender address used by the email API route |

Notes:

- The app degrades gracefully for insight generation by using a local fallback message if the AI call fails.
- Email delivery requires the Resend variables above; without them, the report send route cannot complete successfully.
- Do not commit real credentials or production keys.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project with Auth enabled
- A `sessions` table used by the public flow and admin analytics
- Optional: Groq API access for AI insights
- Optional: Resend account for email delivery

### Installation

```bash
git clone https://github.com/leogpava/flow-metrics
cd FlowMetrics
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public routes:

- `/landing`
- `/flow/dados`
- `/flow/resultado`
- `/flow/email`
- `/flow/confirmacao`

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/health`
- `/admin/demographics`
- `/admin/engagement`
- `/admin/sessions`

## Available Scripts

```bash
npm run dev        # Start the local Next.js dev server
npm run build      # Create a production build
npm run start      # Run the production build
npm run lint       # Run Next.js linting
npm run typecheck  # Run TypeScript checks
```

## Architecture

FlowMetrics uses a split architecture with a client-heavy public assessment flow and server-backed admin analytics:

- The public flow uses Zustand session storage to keep progress between steps inside the browser session.
- Health metrics are calculated in the client from user inputs, then persisted through internal API routes.
- Supabase acts as the system of record for sessions and admin authentication.
- Admin pages fetch protected JSON endpoints, and server-side services aggregate raw session data into dashboard-specific response models.
- Email and AI features are isolated behind API routes so external provider logic stays out of UI components.

## Demo / Preview

No hosted demo URL is configured in this repository. Run the project locally with `npm run dev` to preview the full public and admin experiences.

## Future Improvements

- Add database schema and migration files to make infrastructure setup fully reproducible
- Add automated tests for flow calculations, API routes, and admin aggregations
- Replace temporary test-oriented email behavior with fully editable end-user delivery in all environments
- Add deployment instructions and production environment guidance

