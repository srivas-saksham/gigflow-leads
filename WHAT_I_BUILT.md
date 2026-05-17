# What I Built

**Project:** GigFlow — Smart Leads Dashboard  
**Assignment:** ServiceHive Full Stack Internship  
**Author:** Saksham Srivastava  
**Submitted:** May 2026

---

## Overview

The assignment asked for a full-stack lead management dashboard — authentication, CRUD, filtering, pagination, role-based access, CSV export, and Docker. I built all of that. But I also treated it as a real product, not a checklist exercise. This document covers everything that was required, everything I added on my own initiative, and the specific engineering decisions that I think matter.

---

## What Was Required — And What I Delivered

### Authentication System

JWT-based authentication with 7-day token expiry. Passwords are hashed using bcryptjs with a salt factor of 10. Registration, login, and a `/me` endpoint for session hydration are all in place.

Auth middleware (`protect`) extracts and verifies the Bearer token on every protected route. A separate role middleware (`adminOnly`, `staffOnly`) enforces access control at the route level rather than scattering role checks across controllers. The middleware chain is composable — any route can stack `protect → staffOnly → adminOnly` without any logic duplication.

User input is validated before touching the database. Missing fields return `400`. Email conflicts return `409`. Expired or invalid tokens return `401`. Every error path returns a consistent JSON shape so the frontend never has to guess at the structure.

### Leads Management — Full CRUD

Leads store `name`, `email`, `status`, `source`, `createdBy`, `notes`, and timestamps. Status and source are enum-constrained at the Mongoose schema level, so bad data never reaches the database regardless of what the client sends.

Create, read, update, and delete are all implemented. The update endpoint accepts a partial body — only the fields present in the request are changed. The delete endpoint is admin-gated.

There is also a **public submit endpoint** (`POST /api/leads/submit`) that requires no authentication. This backs the contact form on the homepage. When a visitor fills out the form, their submission lands directly in the dashboard as a `new` lead with `source: website`. The pipeline starts working before anyone on the team has to do anything.

### Advanced Filtering and Search

The leads list endpoint supports simultaneous filtering by status, source, and a case-insensitive name/email search using MongoDB regex. Sort order (latest or oldest) is also a query parameter. All of these compose — requesting `status=qualified&source=instagram&search=rahul&sortBy=oldest` returns exactly what you would expect, and the same filter object is reused by the CSV export endpoint so the export always matches the current view.

On the frontend, search is debounced at 400ms using a custom `useDebounce` hook so the API is not hammered on every keystroke.

### Pagination

Pagination is handled entirely on the backend using `skip` and `limit`. The response always includes a `pagination` metadata object with `total`, `page`, `limit`, and `totalPages`. The frontend uses `totalPages` to render navigation controls and never has to compute page counts itself.

Default page size is 10. The frontend correctly resets the page to 1 whenever a filter changes.

### Frontend UI

The dashboard is fully responsive. The leads table collapses to a card list on mobile. The team management panel does the same. The navbar adapts to a two-row layout on small screens. Nothing breaks at 375px.

All UI states are covered: loading skeletons (not generic spinners — field-level skeleton rows that match the actual layout), empty states with copy, error states with recovery actions. Forms validate before submission and show inline error messages returned by the API.

### API Standards

The API is RESTful. Resource URLs are noun-based. HTTP verbs carry semantic meaning. Status codes are correct and intentional. All errors flow through a single Express error middleware (`errorHandler`) so there is no `res.status(500)` scattered across controllers — controllers call `next(err)` and the middleware handles the rest. In development mode, stack traces are included in error responses.

### Debounced Search

Implemented via a custom hook:

```ts
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
```

The hook is generic, reusable, and cleans up its timeout on every re-render.

### CSV Export

Admin-only. The export endpoint respects whatever filters are currently active in the view. If you're looking at qualified Instagram leads and hit export, the CSV contains exactly those leads — not the entire dataset.

On the frontend, the export button is context-aware. When no filters are active, clicking it exports everything immediately with no extra step. When filters are active, a dropdown appears showing you which filters are applied and how many records match, with two options: export the filtered set, or clear filters and export everything. Cell values are RFC 4180 compliant — commas, quotes, and newlines are handled correctly.

### Role-Based Access Control

Three roles exist: `admin`, `sales`, and `customer`. The permission matrix is:

| Action | Admin | Sales | Customer |
|---|---|---|---|
| View leads | ✅ | ✅ | ❌ |
| Create leads | ✅ | ✅ | ❌ |
| Update leads | ✅ | ✅ | ❌ |
| Delete leads | ✅ | ❌ | ❌ |
| Export CSV | ✅ | ❌ | ❌ |
| Manage team | ✅ | ❌ | ❌ |

`customer` is the role assigned on public self-registration. These users can log in but are immediately redirected to the homepage — they have no path into the dashboard. The `ProtectedRoute` component in React checks both authentication and role before rendering any dashboard content.

### Docker Setup

Both the frontend and backend have their own `Dockerfile`. The backend compiles TypeScript and runs the compiled output. The frontend is a multi-stage build — Vite builds the static assets in the builder stage, and Nginx serves them in production with an SPA fallback rule so client-side routing works correctly.

`docker-compose.yml` wires all three services (MongoDB, backend, frontend) together with a health check on MongoDB so the backend waits for the database to be ready before starting. Internal networking is isolated — MongoDB is not exposed externally.

---

## What I Added

These are things the assignment did not ask for. I added them because they made the product better.

### A Real Homepage With Live Lead Capture

The assignment asked for a dashboard. I built a public-facing homepage too. It has a hero section, a "how it works" walkthrough, an about section that references the actual assignment brief, and a contact form.

The contact form is a multi-step flow — it collects the visitor's interests, team size, name, and email across three steps with animated transitions. When submitted, it hits `POST /api/leads/submit` and creates a real lead in the dashboard. The form explains this to the visitor: "Submitting this creates a live lead in the GigFlow dashboard — that's the pipeline working in real time." It is not fake. It is demonstrating the product while generating leads for it.

### Inline Status Editor With a Portal Dropdown

In the leads table, every status badge has a small chevron next to it. Clicking it opens a dropdown directly in the table row — no modal, no page navigation. The dropdown is rendered via `ReactDOM.createPortal` into `document.body` so it is never clipped by table overflow or scroll containers. Selecting a new status fires a `PUT` request, optimistically updates the UI, and closes the dropdown. The whole interaction takes under a second.

### Live Lead Counter in the Navbar

The navbar shows a live count of new (uncontacted) leads. This is not a static number — it updates every time any lead's status changes anywhere in the dashboard, including through the inline status editor.

The way this works: a `LeadStatsContext` holds a version counter and a `refreshStats` function. The `StatusDropdown` component calls `refreshStats()` after a successful status update. The `useOpenLeads` hook in the Navbar re-fetches the count whenever `statsVersion` increments. No prop drilling. No lifting state up through multiple layers. The Navbar and the deep-nested dropdown communicate through context, which is exactly the pattern React context exists for.

### Full Lead Detail Page

Clicking any lead opens a dedicated detail page at `/leads/:id`. The page has a breadcrumb, a header with the lead's name, email, and a monogram avatar colored by their status, and a two-column layout with contact fields on the left and a timeline, status description, and source context on the right.

The detail page also parses the structured notes that the contact form stores. If a lead came in through the homepage form, their selected interests, team size, and message are displayed as properly labeled fields — not as a raw string. The parser handles both the structured format from the form and free-text notes added manually.

### Team Management Panel

Admins get a second tab in the dashboard for team management. They can add new staff members (admin or sales), edit existing ones, and delete them. They cannot delete themselves.

When a new staff member is created, the dashboard shows a credential card with the generated credentials and a one-click copy button. The copy formats the credentials as a clean text block with the login URL, ready to paste into a message. The card includes a note: "Ask user to change password after first login."

### Dark and Light Mode

The UI supports both themes. The toggle is in the navbar. The preference is persisted to `localStorage` and applied via a `data-theme` attribute on the HTML element, which the CSS custom property system picks up. The theme is applied before the first render so there is no flash of the wrong theme on load.

---

## TypeScript Coverage

TypeScript is used throughout — backend and frontend. Mongoose model interfaces (`ILead`, `IUser`) are defined and used. The `AuthRequest` type extends Express's `Request` to add the `user` object attached by the auth middleware. Frontend types (`Lead`, `User`, `Pagination`, `LeadFilters`) are centralized in `src/types/index.ts`. The use of `any` in the codebase is close to zero and limited to a small number of Express interop points.

---

## What Is Not Here

- No unit tests. Given the timeline, I prioritized coverage of features and code quality over test authoring. The architecture is structured in a way that would make testing straightforward — controllers are thin, business logic is centralized, and the middleware chain is composable.
- JWTs are stored in `localStorage`. This is a deliberate simplification for the assignment context. In a production system, `httpOnly` cookies would be the right choice.

---

*This document was written by Saksham Srivastava as part of the ServiceHive Full Stack Internship submission — May 2026.*