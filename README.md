# Command Center | PerformanceLabs.AI

A personalized operational dashboard built for PerformanceLabs.AI. Dark mode, real-time Slack sync, and everything you need to run the business from one screen.

**Live:** [administrative-dashboard.vercel.app](https://administrative-dashboard-kdwpimcwj-tony-performancels-projects.vercel.app)

---

## What It Does

The Command Center is the daily operating system for PerformanceLabs.AI. It consolidates client management, task tracking, prospect pipeline, content planning, and calendar visibility into a single view.

**Core features:**

- **Personalized greeting** that changes by time of day with rotating daily motivation
- **Live stats bar** showing open items, critical tasks, active clients, pipeline, queued links, and content count
- **Client and prospect management** with tabbed views, contact details, and deal stages
- **Notes and tasks** organized across six categories: Client To-Dos, High Priority, Prospect Updates, Client Meeting Notes, Random Thoughts, and Links to Review
- **Slack sync** that pulls notes from #cowork-daily-organizer at 7am, noon, and 6pm CST (Mon-Fri) and auto-categorizes them
- **Smart link capture** that auto-detects URLs, extracts domains, and renders clickable link chips. Bare URLs pasted from any tab auto-route to Links to Review.
- **LinkedIn content queue** for tracking post ideas, drafts, and publishing status
- **Weekly calendar** with color-coded event types (client, internal, partner, prospect, focus)

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (auto-deploy from main) |
| Slack Integration | Scheduled pulls via Claude Cowork |
| Styling | Inline styles, Inter font, dark mode glass morphism |

---

## Project Structure

```
Administrative-Dashboard/
  index.html          # Entry HTML with favicon, fonts, CSS animations
  package.json        # Dependencies
  vite.config.js      # Vite + React config
  src/
    main.jsx          # React entry point
    CommandCenter.jsx  # Full dashboard (single component file)
```

---

## Supabase Schema

The database lives in Supabase project `ehxrjsghrbowfgeokuiu` with the following tables:

- **notes** - Six-category note system with fields for text, category, client, priority, URL, done status, and Slack metadata
- **clients** - Active client records with contacts and status
- **prospects** - Pipeline tracking with stage, value, and next steps
- **linkedin_posts** - Content queue with title, pillar, status, and snippet
- **slack_sync_log** - Audit trail of each Slack pull with message counts and timestamps

---

## Slack Integration

Notes flow in from the PerformanceLabs Slack workspace:

1. Drop a message in **#cowork-daily-organizer**
2. Scheduled tasks run at **7:03 AM, 12:04 PM, and 6:00 PM CST** (Mon-Fri)
3. Each pull reads new messages, categorizes them into one of six buckets, inserts into Supabase, and logs the sync
4. Messages containing URLs are auto-categorized as **Links to Review** with extracted domain metadata

---

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

## Deployment

Pushes to `main` auto-deploy to Vercel. No manual steps required.

```bash
git add -A
git commit -m "your message"
git push origin main
```

Vercel project: `prj_HwYxA96qGl8a3JPCJ6p0iOOiKTVn`
Team: `team_suKY1buSSFBQE1sZb1yKDXCB`

---

## Environment

The dashboard currently uses seed data hardcoded in `CommandCenter.jsx`. The Supabase integration will replace these with live queries once the `@supabase/supabase-js` client is wired up.

---

Built by Tony Bangert | PerformanceLabs.AI
