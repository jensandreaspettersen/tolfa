# Tolfa Booking — Migration Strategy

**For:** Tech lead, current booking system
**From:** Jens Andreas Pettersen
**Re:** Modernising the booking frontend — approach and next steps

---

## What we built

A clickable proof-of-concept (POC) at **tolfa.vercel.app** — a full Next.js frontend running against mock data that mirrors the existing `hrbs_*` database schema exactly. It covers the four core screens: monthly calendar, new booking form, my bookings, and login. The POC is live, mobile-responsive, and uses the Tolfa brand (Poppins/Georgia fonts, navy `#253551`, tolfa.no logo).

The key finding: the new UI works well. Stakeholders can react to something real rather than a wireframe.

---

## What we learned about the current system

- The database schema (`hrbs_slots`, `hrbs_entries`, `hrbs_members`, etc.) is clean and well-structured — no changes needed.
- There is no existing API layer. All data access is PHP rendering HTML directly.
- Authentication is PHP session-based. We built a working `/api/autologin.php` bridge so logged-in users on the new UI can jump to the legacy admin without re-entering credentials.
- The legacy system can continue running untouched throughout the migration.

---

## Strategy: strangler fig, not a rewrite

**Don't replace everything at once.** Run both systems in parallel. The new frontend gradually takes over screens one by one, all reading from the same database. The legacy system remains the fallback and handles anything not yet migrated (admin panel, reports, etc.).

```
Phase 1 — now     POC live, mock data, stakeholder feedback
Phase 2           Real data: add a thin REST API to the PHP backend
Phase 3           Replace calendar + booking form with Next.js (read + write)
Phase 4           Replace My Bookings
Phase 5           Legacy system becomes admin-only, then retired
```

---

## Steps to make it real

### Phase 2 — Thin API layer (2–3 days backend work)

Add 4–5 JSON endpoints to the existing PHP codebase. No new infrastructure needed — same server, same database.

| Endpoint | Returns |
|---|---|
| `GET /api/slots.php` | All rooms with capacity |
| `GET /api/entries.php?year=&month=` | Bookings for a given month |
| `GET /api/my-entries.php` | Bookings for the logged-in member |
| `POST /api/entries.php` | Create a new booking |
| `GET /api/session.php` | Current session member (for auth handoff) |

Each endpoint reads from the existing tables — no schema changes. Authentication reuses the existing PHP session cookie (same domain) or the autologin token for cross-origin.

### Phase 3–4 — Connect Next.js to real data (1–2 days)

In the Next.js codebase, swap `lib/mock-data.ts` calls for `fetch()` calls to the PHP API. The type definitions (`lib/types.ts`) already match the database — this is a mechanical substitution.

Deploy to a subdomain (e.g. `ny.tolfa.no`) alongside the existing system.

### Phase 5 — Cutover

Once users have validated the new UI on the subdomain, point `booking.tolfa.no` (or equivalent) at the Next.js app. Legacy system stays alive at its current URL for admins.

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Data inconsistency during parallel run | Both systems write to the same DB — no sync needed |
| Auth breakage | Autologin bridge already tested and working |
| Users confused by two URLs | "Ny versjon" / "Klassisk versjon" banner already implemented |
| Legacy PHP not easy to add endpoints to | Endpoints are simple `SELECT` queries — minimal PHP knowledge required |

---

## What we need from the tech lead

1. **Access** to the production server to add the API endpoints (or a dev environment with the real DB)
2. **Confirmation** that the `hrbs_*` schema hasn't diverged from the version we reverse-engineered
3. **A subdomain** (e.g. `ny.tolfa.no`) to run the connected Next.js app before cutover
4. **Sign-off** on the mock data being representative enough for stakeholder review

---

*POC source code: github.com/jensandreaspettersen/tolfa*
*Live demo: tolfa.vercel.app*
