# RABKL Next Newsroom (Starter)

Futuristic, red-forward Next.js (App Router) + Tailwind site for your Manus-powered fantasy newsroom.

## Features
- Sleek UI (ticker, featured, cards, team pages, power page)
- Oswald (headlines) + Inter (body)
- Red-forward palette (#D21E2B) with navy base
- Manus-compatible content structure under `/content`
- API route placeholder at `/app/api/publish/route.ts`

## Quickstart
```bash
npm install
npm run dev
```

## Manus expectations
Publish files to:
- `content/YYYY/MM/DD/<slug>.json`  (metadata for UI lists)
- `public/images/<slug>.png`        (hero/thumbnail images)
- (Optional) Keep your Markdown anywhere or in a CMS; this UI uses JSON summaries for speed.

Or adapt the readers to parse front-matter from MD.

## Deploy
- Push to GitHub and import into Vercel.
- Replace `/app/api/publish/route.ts` with your GET/POST bypass code.
- Add your bypass token in Vercel protection settings.
```

