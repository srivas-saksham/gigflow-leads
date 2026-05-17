# GigFlow API Reference

**Base URL:** `https://gigflow-leads-api.onrender.com`  
**Version:** 1.0  
**Format:** All requests and responses use `application/json` unless noted otherwise.

---

## Overview

The GigFlow API is a RESTful HTTP API that powers the GigFlow Smart Leads Dashboard. It exposes two primary resource groups — **Auth** (user identity and team management) and **Leads** (pipeline records). A third utility endpoint handles public lead submissions from the marketing site.

Authentication is Bearer-token based. Tokens are issued on login or registration and are valid for 7 days. Every protected endpoint requires the token to be present in the `Authorization` header.

---

## Authentication

All protected routes require:

```
Authorization: Bearer <token>
```

Tokens that are missing, malformed, or expired return `401 Unauthorized`. Requests made with a valid token but insufficient role return `403 Forbidden`.

---

## Roles

| Role | Description |
|---|---|
| `admin` | Full access — can manage leads, team members, and export data |
| `sales` | Can view, create, and update leads; cannot delete or export |
| `customer` | Public-facing role assigned on self-registration; no dashboard access |

---

## Error Format

All errors follow a consistent envelope:

```json
{
  "message": "Human-readable description of the error"
}
```

In development mode, a `stack` field is also included. Errors are never wrapped in a `data` or `error` key — the message surfaces at the top level.

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Resource created |
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — token missing or expired |
| `403` | Forbidden — valid token but insufficient role |
| `404` | Resource not found |
| `409` | Conflict — typically a duplicate email |
| `500` | Internal server error |

---

## Auth

### Register

```
POST /api/auth/register
```

Creates a new account with the `customer` role. The role cannot be overridden through this endpoint regardless of what is sent in the request body. Staff accounts must be created through `POST /api/auth/staff`.

**Request body**

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `email` | string | Yes |
| `password` | string | Yes |

**Example request**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "securepassword"
}
```

**Response — `201`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "customer"
  }
}
```

---

### Login

```
POST /api/auth/login
```

Authenticates an existing user and returns a signed JWT alongside the user object.

**Request body**

| Field | Type | Required |
|---|---|---|
| `email` | string | Yes |
| `password` | string | Yes |

**Response — `200`**

Same shape as the register response.

**Errors**

- `400` — email or password missing
- `401` — credentials do not match any account

---

### Get current user

```
GET /api/auth/me
```

Requires authentication.

Returns the authenticated user's profile. Useful for session hydration on page load.

**Response — `200`**

```json
{
  "user": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "admin"
  }
}
```

---

### Create staff account

```
POST /api/auth/staff
```

Requires authentication. Admin only.

Creates an `admin` or `sales` team member. Credentials should be communicated to the new member out of band — the API returns the created user object but does not email them.

**Request body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | |
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Stored as bcrypt hash |
| `role` | string | Yes | `"admin"` or `"sales"` |

**Response — `201`**

```json
{
  "user": {
    "id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Priya Verma",
    "email": "priya@company.com",
    "role": "sales"
  }
}
```

**Errors**

- `400` — missing fields or invalid role
- `409` — email already registered

---

### List staff users

```
GET /api/auth/users
```

Requires authentication. Admin only.

Returns all accounts with role `admin` or `sales`, sorted by creation date descending. Customer accounts are excluded.

**Response — `200`**

```json
{
  "users": [
    {
      "id": "664f1a2b3c4d5e6f7a8b9c0e",
      "name": "Priya Verma",
      "email": "priya@company.com",
      "role": "sales",
      "createdAt": "2026-05-01T10:30:00.000Z"
    }
  ]
}
```

---

### Update staff user

```
PUT /api/auth/users/:id
```

Requires authentication. Admin only.

Updates a team member's name, email, role, or password. All fields are optional except `role`, which must always be a valid staff role if provided. Sending an empty string for `password` leaves the existing password unchanged.

**Request body**

| Field | Type | Required |
|---|---|---|
| `name` | string | No |
| `email` | string | No |
| `role` | string | Yes |
| `password` | string | No |

**Response — `200`**

```json
{
  "user": {
    "id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Priya Verma",
    "email": "priya@company.com",
    "role": "admin"
  }
}
```

**Errors**

- `400` — invalid role value
- `404` — user not found
- `409` — updated email conflicts with an existing account

---

### Delete staff user

```
DELETE /api/auth/users/:id
```

Requires authentication. Admin only.

Permanently deletes a team member. An admin cannot delete their own account through this endpoint — the API returns `400` if the authenticated user attempts to delete themselves.

**Response — `200`**

```json
{
  "message": "User deleted"
}
```

**Errors**

- `400` — cannot delete own account
- `404` — user not found

---

## Leads

### Submit a public lead

```
POST /api/leads/submit
```

No authentication required.

This is the endpoint that backs the public contact form on the marketing homepage. Leads submitted here are automatically assigned `status: "new"` and `source: "website"`. An optional `message` field is stored internally as notes on the lead record and surfaces in the lead detail view on the dashboard.

**Request body**

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `email` | string | Yes |
| `message` | string | No |

**Response — `201`**

```json
{
  "message": "Thanks! We will be in touch soon.",
  "lead": {
    "_id": "664f1a2b3c4d5e6f7a8b9c10",
    "name": "Arjun Singh",
    "email": "arjun@example.com",
    "status": "new",
    "source": "website",
    "createdAt": "2026-05-17T08:00:00.000Z"
  }
}
```

---

### List leads

```
GET /api/leads
```

Requires authentication. Staff only (admin or sales).

Returns a paginated, filterable list of leads. All query parameters are optional and composable — multiple filters applied simultaneously narrow the result set using logical AND.

**Query parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | string | — | Filter by status: `new`, `contacted`, `qualified`, `lost` |
| `source` | string | — | Filter by source: `website`, `instagram`, `referral` |
| `search` | string | — | Case-insensitive regex match on `name` or `email` |
| `sortBy` | string | `latest` | `latest` (newest first) or `oldest` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Results per page |

**Example request**

```
GET /api/leads?status=qualified&source=instagram&search=rahul&sortBy=latest&page=1
```

**Response — `200`**

```json
{
  "leads": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c10",
      "name": "Rahul Mehta",
      "email": "rahul.mehta@example.com",
      "status": "qualified",
      "source": "instagram",
      "createdAt": "2026-05-10T14:22:00.000Z",
      "updatedAt": "2026-05-14T09:05:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### Create a lead

```
POST /api/leads
```

Requires authentication. Staff only.

Creates a new lead manually. This is distinct from the public submission endpoint — it requires authentication and allows the creator to set any status and source.

**Request body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | |
| `email` | string | Yes | Stored as lowercase |
| `source` | string | Yes | `website`, `instagram`, or `referral` |
| `status` | string | No | Defaults to `"new"` |

**Response — `201`**

```json
{
  "lead": {
    "_id": "664f1a2b3c4d5e6f7a8b9c11",
    "name": "Sneha Kapoor",
    "email": "sneha@example.com",
    "status": "new",
    "source": "referral",
    "createdAt": "2026-05-17T11:00:00.000Z",
    "updatedAt": "2026-05-17T11:00:00.000Z"
  }
}
```

---

### Get a single lead

```
GET /api/leads/:id
```

Requires authentication. Staff only.

Returns the full lead document by its MongoDB ObjectId. Includes the `notes` field if present, which stores structured submission context for leads that came through the public contact form.

**Response — `200`**

```json
{
  "lead": {
    "_id": "664f1a2b3c4d5e6f7a8b9c10",
    "name": "Arjun Singh",
    "email": "arjun@example.com",
    "status": "contacted",
    "source": "website",
    "notes": "Interests: track, pipeline | Team size: 10–50 | Message: Looking for a CRM alternative",
    "createdAt": "2026-05-10T08:00:00.000Z",
    "updatedAt": "2026-05-12T10:30:00.000Z"
  }
}
```

**Errors**

- `404` — no lead found with the given ID

---

### Update a lead

```
PUT /api/leads/:id
```

Requires authentication. Staff only.

Updates any subset of a lead's fields. Sales users can update all lead fields through this endpoint; field-level role enforcement is handled at the business logic layer rather than the API layer, keeping the interface simple.

**Request body**

Any combination of the following:

| Field | Type |
|---|---|
| `name` | string |
| `email` | string |
| `status` | string |
| `source` | string |
| `notes` | string |

**Example — status update only**

```json
{
  "status": "qualified"
}
```

**Response — `200`**

```json
{
  "lead": {
    "_id": "664f1a2b3c4d5e6f7a8b9c10",
    "name": "Arjun Singh",
    "email": "arjun@example.com",
    "status": "qualified",
    "source": "website",
    "updatedAt": "2026-05-17T12:00:00.000Z"
  }
}
```

**Errors**

- `404` — lead not found

---

### Delete a lead

```
DELETE /api/leads/:id
```

Requires authentication. Admin only.

Permanently removes a lead record. This action is irreversible.

**Response — `200`**

```json
{
  "message": "Lead deleted"
}
```

**Errors**

- `403` — caller does not have admin role
- `404` — lead not found

---

### Export leads as CSV

```
GET /api/leads/export
```

Requires authentication. Admin only.

Streams a UTF-8 encoded CSV file containing lead records. Accepts the same filter parameters as `GET /api/leads` — the export always reflects the active view rather than dumping the entire dataset blindly. Pagination parameters are ignored; all matching records are included.

**Query parameters**

Same as `GET /api/leads` — `status`, `source`, `search`. Pagination params (`page`, `limit`, `sortBy`) are ignored.

**Response headers**

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename=leads.csv
```

**CSV columns**

```
Name, Email, Status, Source, Created At
```

Dates are formatted as `DD/MM/YYYY`. Cell values containing commas, double quotes, or newlines are wrapped in double quotes per RFC 4180.

**Errors**

- `403` — caller does not have admin role

---

## Health

```
GET /health
```

No authentication required. Returns a simple status object. Useful for uptime monitoring or container orchestration readiness checks.

**Response — `200`**

```json
{
  "status": "ok"
}
```

---

## Pagination

Paginated endpoints return a `pagination` object alongside the data array:

```json
{
  "pagination": {
    "total": 84,
    "page": 2,
    "limit": 10,
    "totalPages": 9
  }
}
```

Use `total` and `totalPages` to render navigation controls. The default page size is 10 records. There is currently no enforced maximum on the `limit` parameter — pass a large number cautiously in export-adjacent use cases, and prefer the dedicated CSV export endpoint for bulk data access.

---

## Rate Limiting

No rate limiting is currently enforced at the API layer. The underlying MongoDB Atlas free tier imposes its own connection limits. For high-volume or automated usage, batch requests conservatively.

---

## CORS

The API accepts requests from the configured `CLIENT_URL` origin only. Cross-origin requests from other domains are rejected at the Express CORS middleware layer. When running locally, the default permitted origin is `http://localhost:5173`.

---

*GigFlow API · Built by Saksham Srivastava · ServiceHive Full Stack Internship Assignment · May 2026*