# 🏓 PickleSync FastAPI + Supabase Backend

High-performance Python backend built with **FastAPI** and **Supabase (PostgreSQL)** for PickleSync pickleball court reservations, atomic slot locks, smart gate PIN generation, and club administration.

---

## 🚀 Quick Start

### 1. Run the FastAPI Server
The virtual environment is already prepared in `backend/venv`:

```bash
# From project root:
backend/venv/bin/uvicorn app.main:app --app-dir backend --reload --port 8000
```
Or use the npm shortcut from root:
```bash
npm run dev:backend
```

### 2. View Interactive Swagger API Docs
Open your browser to:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🗄 Supabase Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** tab.
3. Paste and run the contents of [`backend/supabase_schema.sql`](./supabase_schema.sql).
4. Copy your project credentials from **Project Settings > API**:
   - `Project URL` -> `SUPABASE_URL`
   - `anon public` key -> `SUPABASE_KEY`
   - `service_role secret` key -> `SUPABASE_SERVICE_KEY`
5. Create a `backend/.env` file:
   ```bash
   cp backend/.env.example backend/.env
   # Edit with your Supabase keys
   ```

*Note: The backend features an intelligent dual-mode fallback: if Supabase keys are not set yet, it runs with a thread-safe in-memory store so development and testing can proceed seamlessly.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/courts` | List active courts (Court #1 & Court #2) |
| `GET` | `/api/v1/courts/availability` | Real-time slots for a date (enforces 5-day advance window) |
| `POST` | `/api/v1/bookings` | Atomically book slots, reserve lock, generate gate PIN |
| `GET` | `/api/v1/bookings` | List active bookings |
| `POST` | `/api/v1/bookings/{id}/cancel`| Cancel booking and release occupied slots |
| `GET` | `/api/v1/admin/metrics` | Calculate today's revenue, occupancy %, active counts |
| `PATCH` | `/api/v1/admin/courts/{id}/status` | Update court status (`available`, `in_play`, etc.) |
| `GET` | `/api/v1/admin/bookings` | Admin booking audit feed |

