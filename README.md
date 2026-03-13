# Inner Bloom 🌸 (Hackathon Full‑Stack Demo)

**Inner Bloom** is an AI-driven early PCOS risk prediction and lifestyle recommendation system for women’s health.

This repo is **deployment-ready** and follows the required architecture:

- **Frontend**: React + Tailwind + React Router + Chart.js + Leaflet
- **Backend**: Node.js + Express + Controllers/Services (business logic layer)
- **Database**: MongoDB (Mongoose)

---

## Folder structure

```
inner-bloom
├── frontend
└── backend
```

---

## Prerequisites

- Node.js (installed)
- MongoDB running locally (or a MongoDB Atlas URI)

---

## Environment variables

### Backend

Create `backend/.env` (or edit the existing one) using `backend/.env.example`:

- `MONGODB_URI`: Mongo connection string
- `JWT_SECRET`: secret string for JWT
- `CLIENT_ORIGIN`: typically `http://localhost:5173`

**Email reminders (optional):**

Set SMTP values in `backend/.env` if you want email reminders:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM_EMAIL`

---

## Run the project (dev)

### 1) Start MongoDB

Make sure MongoDB is running on:

`mongodb://127.0.0.1:27017`

### 2) Run backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

Test:
- `GET /health`
- `GET /api`

### 3) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Main flow (demo)

Landing → Language selection → Register/Login → Assessment → AI Risk Results → Recommendations → Diet Plan (PDF) → Reminders + Calendar → Nearby Doctors (map) → Dashboard → Feedback + Analytics → Chatbot widget

---

## Backend API (key endpoints)

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Assessment**
- `POST /api/assessments`
- `GET /api/assessments/latest`
- `GET /api/assessments/history?limit=10`

**Diet plans**
- `POST /api/diet-plans/generate` (body: `{ "language": "en" | "hi" | "mr" }`)
- `GET /api/diet-plans/latest`

**Reminders**
- `GET /api/reminders`
- `POST /api/reminders` (body: `{ reminders: [{ type, time, enabled }] }`)

**Feedback**
- `POST /api/feedback`
- `GET /api/feedback/mine`
- `GET /api/feedback/analytics`

---

## Notes

- **AI module** is a **prototype** (rule-based scoring + explanations) suitable for hackathon demos.
- **Google Calendar** uses a “pre-filled event” link (1‑click add). For full OAuth API integration, you can extend it later.
- **Doctors map** uses **OpenStreetMap Overpass API** (no API key) for hackathon-friendly demo.

