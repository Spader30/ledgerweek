# LedgerWeek

Premium MVP web app for wedding/event vendors to run a weekly operating system: deliverables + pipeline + invoices measured by a Revenue Risk Score and stored as Week Cards.

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
Push to GitHub → Import to Vercel → No env vars required.

## Auth
Mock auth (cookie + localStorage) with middleware route protection. Swap for Clerk/NextAuth later by replacing `lib/auth.ts` + `middleware.ts`.
