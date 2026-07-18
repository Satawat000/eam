# Enterprise Access Management System — Next.js

Next.js 14 (App Router) port of the Access Management design for Vantage Financial Group.

## Run

```bash
cd nextjs
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
app/
  layout.tsx        # Sidebar + Toast provider shell (wraps every page)
  globals.css       # theme tokens (--accent, --bg, --panel…) + resets
  page.tsx          # Dashboard (server component)
  users/page.tsx    # Users table + detail / Invite / Manage-access modals
  roles/page.tsx    # Roles list + permission matrix + Edit-role modal
  requests/page.tsx # Pending/Approved/Denied tabs, approve/deny, new request
  audit/page.tsx    # Searchable, filterable audit log
components/
  Sidebar.tsx       # left nav (active state via usePathname) + PageHeader
  Modal.tsx         # Modal shell + Button/Badge/field-style helpers
  Toast.tsx         # ToastProvider + useToast() hook
lib/
  types.ts          # shared types + SYSTEMS / DEPARTMENTS constants
  data.ts           # mock users/roles/grants/requests/audit + style helpers
```

## Notes

- Styling mirrors the prototype: inline styles + a handful of CSS custom
  properties in `globals.css`. Swap for Tailwind/CSS Modules if you prefer —
  change `--accent` in one place to re-theme.
- Pages that mutate state (`users`, `roles`, `requests`, `audit`) are Client
  Components (`'use client'`). The Dashboard is a Server Component.
- Data is in-memory (`lib/data.ts`). To make it real:
  1. Add Prisma + Postgres; model `User`, `Role`, `Permission`, `Request`,
     `AuditEvent`.
  2. Replace the `useState(seed…)` calls with data fetched in Server
     Components / Route Handlers.
  3. Turn modal submit handlers into Server Actions that write to the DB and
     `revalidatePath()`, and insert an audit row on every mutation.
- Auth: drop in Auth.js (NextAuth) or Clerk, then gate routes by role in
  `middleware.ts` to match the permission matrix.

## Layout variations

The original prototype exposed nav-layout (sidebar / rail / topbar), density,
and accent as tweaks. Here the sidebar layout is wired; to re-add the others,
lift `navLayout`/`density`/`accent` into a context provider around the shell in
`app/layout.tsx` and read them in `Sidebar.tsx`.
