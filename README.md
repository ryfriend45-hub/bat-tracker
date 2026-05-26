# Bat Tracker — Deployment Guide

## IMPORTANT: Deploy via GitHub to activate live data

Drag-and-drop deployment on Netlify does NOT activate the serverless function
that proxies FanGraphs. You must connect via GitHub for live data to work.

---

## Step 1 — Push to GitHub

If you don't have git installed, download it from https://git-scm.com

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/statcast-tracker
git init
git add .
git commit -m "Initial deploy"
```

Then go to https://github.com/new, create a new repo (call it bat-tracker),
and run the commands GitHub shows you to push.

---

## Step 2 — Connect to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub" and authorize Netlify
4. Select your bat-tracker repo
5. Build settings will be auto-detected from netlify.toml
6. Click "Deploy site"

Netlify will deploy AND activate the FanGraphs proxy function.
The yellow "showing sample data" banner will disappear.

---

## Step 3 — Add to iPhone

1. Open your Netlify URL in Safari
2. Tap Share → "Add to Home Screen"
3. Tap Add

---

## If you want to keep drag-and-drop

The app still works with sample data from May 13-17 2026.
To get live data without GitHub, install Netlify CLI:

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

This activates functions correctly via drag-and-drop equivalent.
