# My Students - Read-Only Web Mirror

- Framework: Next.js App Router + TypeScript + Tailwind + shadcn/ui
- Purpose: Read-only mirror of the Electron desktop app, synced via Firestore in realtime.

## Excluded routes
- Settings, Broadcast, Backup & Restore, Reports, License validation (redirect or hidden)

## Env
- Add Firebase web config JSON to `NEXT_PUBLIC_FIREBASE_CONFIG` in Vercel

## Develop
```
pnpm i # or npm i / yarn
pnpm dev
```

## Deploy
- Push to GitHub
- Import to Vercel
- Add env var `NEXT_PUBLIC_FIREBASE_CONFIG`
- Build: `next build`
