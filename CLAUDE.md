# Equitracción - Claude Code Project Guide

## Project Overview
Website for Equitracción (equine traction forestry services). Astro 5 SSR on Vercel with Firebase backend.

## Stack
- **Framework:** Astro 5.15 (SSR mode, `output: 'server'`)
- **Hosting:** Vercel Serverless Functions
- **Database:** Firebase Firestore (europe-west1)
- **Storage:** Firebase Cloud Storage (equitraccion-web.firebasestorage.app)
- **Auth:** Custom JWT (not Firebase Auth)
- **CSS:** TailwindCSS v4
- **Email:** Resend (lazy init, optional)
- **Domain:** equitraccion.com

## Architecture

### Key Files
- `src/lib/firebase.ts` — Firebase Admin SDK singleton, TypeScript interfaces
- `src/lib/firestore-helpers.ts` — `calculateReadingTime()`, `nowISO()`
- `src/lib/auth/jwt.ts` — JWT generation/verification, `isAuthenticated()`
- `src/lib/auth/server.ts` — Wrapper for Astro page frontmatter context
- `src/lib/email/resend-client.ts` — All email functions (lazy Resend init)
- `src/lib/security/rate-limiter.ts` — Rate limiting for login/contact
- `src/lib/validation/sanitize.ts` — Input sanitization
- `src/middleware.ts` — Auth middleware + CSP headers

### Firestore Collections
| Collection | Doc ID | Notes |
|---|---|---|
| `blog_posts` | slug | Natural key, O(1) lookup |
| `newsletter_subscriptions` | email | Guarantees uniqueness |
| `contact_submissions` | auto (UUID) | No natural key |
| `courses` | auto (UUID) | Generic ID |

### API Endpoints (24 total)
- `/api/auth/login|logout` — JWT auth
- `/api/blog/posts`, `/api/blog/[slug]` — Public blog
- `/api/posts` — Admin CRUD (GET/POST/PATCH/DELETE)
- `/api/admin/posts/list|[id]|toggle-published|delete` — Admin post management
- `/api/contact` — Public contact form
- `/api/admin/messages/list|[id]` — Admin message management
- `/api/newsletter/subscribe|unsubscribe` — Public newsletter
- `/api/newsletter/list|toggle-status|delete|send` — Admin newsletter
- `/api/courses|[id]` — Course CRUD
- `/api/admin/stats` — Dashboard statistics
- `/api/upload-image` — Image upload to Firebase Storage

## Development Commands
```bash
npm run dev          # Local dev server
npm run build        # Build for production
vercel --prod        # Deploy to production (reliable)
firebase deploy --only firestore:indexes   # Deploy Firestore indexes
firebase deploy --only storage             # Deploy Storage rules
```

## Important Conventions
- Always use `process.env` fallback for env vars (Vercel doesn't expose non-PUBLIC_ via import.meta.env)
- Use `import.meta.env.PROD` for production boolean (NOT NODE_ENV)
- Firestore uses `preferRest: true` to avoid gRPC bundling issues
- Do NOT add `ssr.external` to astro.config.mjs — breaks @opentelemetry/api
- Resend uses lazy init pattern — never `new Resend(undefined)`
- DELETE/PUT/PATCH requests need `Origin` header (Astro CSRF protection)
- Composite Firestore indexes defined in `firestore.indexes.json`
