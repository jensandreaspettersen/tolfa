// URL of the classic PHP booking system.
// Set NEXT_PUBLIC_CLASSIC_URL=http://localhost:8000 in .env.local for local dev.
// Leave unset on Vercel POC — classic links will be hidden automatically.
export const CLASSIC_URL =
  process.env.NEXT_PUBLIC_CLASSIC_URL ?? ''
