# GigFlow — Smart Leads Dashboard

**Live:** https://gigflow-leads.vercel.app · **API:** https://gigflow-leads-api.onrender.com

> Built by Saksham Srivastava · ServiceHive Full Stack Internship Assignment · May 2026

A full-stack lead management application built as a ServiceHive internship assignment. Built with the MERN stack, fully typed in TypeScript end-to-end.

### Seed Admin Credentials
- Email: saksham@gigflow.admin
- Pass: admin@gigflow

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day expiry) + bcrypt |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Quick Start (Docker — recommended)

```bash
# 1. Clone the repo
git clone https://github.com/srivas-saksham/gigflow-leads.git
cd gigflow-leads

# 2. Configure environment
cp .env.example .env
# Edit .env and set JWT_SECRET

# 3. Spin up everything
docker compose up --build
```

The app will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: internal (port 27017, not exposed externally)

---

## Manual Setup (Development)

### Prerequisites
- Node.js ≥ 20
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET

npm install
npm run dev        # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000

npm install
npm run dev        # starts on http://localhost:5173
```

### Environment Variables

**`backend/.env`**
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000
```

---

## Seeding (optional)

```bash
cd backend
npm run seed
```

This creates one admin and one sales user with sample leads.

---

## API Documentation

Base URL: `http://localhost:5000`

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Auth

#### `POST /api/auth/register`
Register a new customer account.

**Body**
```json
{ "name": "Jane Smith", "email": "jane@example.com", "password": "secret123" }
```

**Response** `201`
```json
{ "token": "...", "user": { "id": "...", "name": "Jane Smith", "email": "jane@example.com", "role": "customer" } }
```

---

#### `POST /api/auth/login`
Login with email and password.

**Body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response** `200` — same shape as register.

---

#### `GET /api/auth/me` 🔒
Returns the currently authenticated user.

**Response** `200`
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

---

#### `POST /api/auth/staff` 🔒 Admin only
Create a new admin or sales team member.

**Body**
```json
{ "name": "Alice", "email": "alice@co.com", "password": "temp1234", "role": "sales" }
```

**Response** `201`
```json
{ "user": { "id": "...", "name": "Alice", "email": "alice@co.com", "role": "sales" } }
```

---

#### `GET /api/auth/users` 🔒 Admin only
List all staff users (admin + sales).

**Response** `200`
```json
{ "users": [ { "id": "...", "name": "...", "email": "...", "role": "admin", "createdAt": "..." } ] }
```

---

#### `PUT /api/auth/users/:id` 🔒 Admin only
Update a team member's details.

**Body** (all optional except role)
```json
{ "name": "Alice B", "email": "aliceb@co.com", "role": "admin", "password": "newpass" }
```

**Response** `200` — updated user object.

---

#### `DELETE /api/auth/users/:id` 🔒 Admin only
Delete a team member. Cannot delete your own account.

**Response** `200`
```json
{ "message": "User deleted" }
```

---

### Leads

#### `POST /api/leads/submit`
Public endpoint — no auth required. Used by the homepage contact form. Automatically creates a `new` lead with source `website`.

**Body**
```json
{ "name": "Bob", "email": "bob@example.com", "message": "Interested in the product" }
```

**Response** `201`
```json
{ "message": "Thanks! We will be in touch soon.", "lead": { ... } }
```

---

#### `GET /api/leads` 🔒 Staff only
Fetch paginated, filtered leads.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `new \| contacted \| qualified \| lost` | Filter by status |
| `source` | `website \| instagram \| referral` | Filter by source |
| `search` | string | Search name or email (regex, case-insensitive) |
| `sortBy` | `latest \| oldest` | Sort order (default: latest) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

**Response** `200`
```json
{
  "leads": [ { "_id": "...", "name": "...", "email": "...", "status": "new", "source": "website", "createdAt": "..." } ],
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

---

#### `POST /api/leads` 🔒 Staff only
Create a new lead.

**Body**
```json
{ "name": "Carol", "email": "carol@example.com", "source": "referral", "status": "new" }
```

**Response** `201` — created lead object.

---

#### `GET /api/leads/:id` 🔒 Staff only
Get a single lead by ID.

**Response** `200` — lead object.

---

#### `PUT /api/leads/:id` 🔒 Staff only
Update a lead. Sales users can update status; admins can update all fields.

**Body** (any subset of lead fields)
```json
{ "status": "contacted" }
```

**Response** `200` — updated lead object.

---

#### `DELETE /api/leads/:id` 🔒 Admin only
Delete a lead.

**Response** `200`
```json
{ "message": "Lead deleted" }
```

---

#### `GET /api/leads/export` 🔒 Admin only
Export leads as a CSV file. Respects the same filter params as `GET /api/leads` (status, source, search), so the export matches the current view.

**Query params** — same as `GET /api/leads` (pagination params ignored)

**Response** — `text/csv` file download (`leads.csv`)

Columns: `Name, Email, Status, Source, Created At`

---

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (missing/invalid fields) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already in use) |
| 500 | Internal Server Error (centralized handler) |

---

## Architecture Notes

### Role-Based Access Control

| Action | Admin | Sales |
|--------|-------|-------|
| View leads | ✅ | ✅ |
| Create leads | ✅ | ✅ |
| Update leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| Manage team | ✅ | ❌ |

### Error Handling
All errors flow through a single Express error middleware (`backend/src/middleware/errorMiddleware.ts`). Controllers call `next(err)` instead of duplicating `res.status(500)` inline. In development mode, stack traces are included in error responses.

### JWT Storage
JWTs are stored in `localStorage` for simplicity in this assignment context. In production, `httpOnly` cookies are recommended to mitigate XSS risk.

### Dark Mode
The app supports a switchable dark/light theme. The toggle persists the preference to `localStorage` and applies it via `data-theme` attribute on `<html>`. CSS custom properties drive the full palette for both themes.

---

## Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://gigflow-leads.vercel.app |
| Backend (Render) | https://gigflow-leads-api.onrender.com |

> **Note:** The Render free tier spins down after inactivity — first request may take ~30s.

---

## Project Structure

```
gigflow-leads/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers (authController, leadController)
│   │   ├── middleware/     # auth, role, error handlers
│   │   ├── models/         # Mongoose schemas (User, Lead)
│   │   ├── routes/         # Express routers
│   │   ├── types/          # Shared TypeScript interfaces
│   │   └── index.ts        # App entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (leads, team, ui, layout, home)
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── hooks/          # useLeads, useDebounce
│   │   ├── pages/          # Dashboard, Home, Login, Register
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Axios instance with interceptors
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

Built by **Saksham Srivastava** · ServiceHive Full Stack Internship Assignment · May 2026