# VedaAI - AI Assessment Creator

A full-stack web application that lets teachers create assignments and generate structured question papers using AI. Built as part of the VedaAI Full Stack Engineering Assignment.

**Live Demo:** [https://assignment-generator-three.vercel.app](https://assignment-generator-three.vercel.app)

---

## Approach

The idea was to keep things simple and functional. A teacher fills out a form (subject, question types, marks, etc.), the backend queues the request, an AI generates a structured question paper, and the frontend displays it in a clean exam-paper format — all in real time via WebSocket.

The AI response is never rendered directly. It's parsed into structured JSON, validated with Zod, and only then stored and displayed. This ensures consistency regardless of what the LLM returns.

---

## Architecture Overview

```
Frontend (Next.js + TypeScript)
    │
    ├── Assignment List Page      → View, search, filter, delete assignments
    ├── Create Assignment Form    → Title, subject, due date, question types, marks
    └── Output Page               → Structured question paper display
         │
    [Redux Toolkit for state]
    [WebSocket for real-time updates]
         │
         ▼
Backend (Express + TypeScript)
    │
    ├── REST API                  → CRUD for assignments
    ├── BullMQ Queue              → Async AI generation jobs
    ├── BullMQ Worker             → Calls LLM, parses response, stores result
    ├── WebSocket Server          → Pushes status updates to frontend
    │
    ├── MongoDB                   → Stores assignments and generated papers
    └── Redis                     → BullMQ backing store + paper caching
```

**How a request flows:**

1. Teacher submits the form → `POST /api/assignments`
2. Backend saves the assignment (status: pending) and adds a job to BullMQ
3. Returns immediately with the assignment ID
4. Frontend subscribes via WebSocket for that assignment
5. Worker picks up the job → builds a prompt → calls the LLM
6. Parses the JSON response → validates with Zod → saves to MongoDB
7. Emits `generation-completed` via WebSocket
8. Frontend receives the event and shows the generated paper

---

## Tech Stack

**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, react-hook-form, Zod

**Backend:** Node.js, Express, TypeScript, Mongoose, ioredis, BullMQ, ws

**AI:** OpenRouter API (Gemini 2.5 Flash) with structured prompt + JSON parsing

**Infra:** Docker Compose (MongoDB + Redis for local dev), Vercel (frontend), Render (backend), MongoDB Atlas, Upstash Redis

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for local MongoDB + Redis)
- An OpenRouter API key ([openrouter.ai](https://openrouter.ai))

### 1. Clone and install

```bash
git clone <repo-url>
cd vedaai-assessment
```

### 2. Start MongoDB and Redis locally

```bash
docker compose up -d
```

### 3. Backend

```bash
cd server
npm install
```

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
OPENROUTER_API_KEY=your_key_here
CLIENT_URL=http://localhost:3000
JWT_SECRET=any-random-secret-string
```

Start the server:

```bash
npm run dev
```

### 4. Frontend

```bash
cd client
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

### 5. Open the app

Go to [http://localhost:3000](http://localhost:3000). Register an account and start creating assignments.

---

## Core Features (as per assignment requirements)

### 1. Assignment Creation

- Form with file upload (drag & drop), due date, dynamic question type rows (type + count + marks), additional instructions
- Proper validation — no empty or negative values
- Redux Toolkit for state management
- WebSocket for real-time generation updates

### 2. AI Question Generation

- Input is converted into a structured prompt (not sent raw)
- LLM generates sections (A, B, etc.) with questions, difficulty tags, and marks
- Response is parsed from JSON and validated with Zod before rendering
- Raw LLM output is never displayed directly

### 3. Backend System

- Node.js + Express with TypeScript
- MongoDB for storing assignments and generated papers
- Redis for caching and BullMQ job state
- BullMQ for background generation jobs with retries
- WebSocket (ws library) for pushing real-time status updates

### 4. Output Page

- Clean exam-paper layout with school name, subject, class, time allowed, max marks
- Student info section (Name, Roll Number, Section lines)
- Questions grouped into sections with titles and instructions
- Each question shows difficulty tag and marks
- Mobile responsive
- Difficulty badges color-coded (green/yellow/red)

---

## Additional Features (beyond requirements)

These are things I added on top of what was asked:

- **JWT Authentication** — Register/login system with protected routes. Users only see their own session.
- **Regenerate Paper** — One-click regeneration from the output page without going back to the form.
- **Redis Caching** — Generated papers are cached for 1 hour so repeat views load instantly.
- **Answer Key** — The AI also generates an answer key below the question paper.
- **Filter by Subject** — The assignments list can be filtered by subject.
- **Sort by Date** — Sort assignments by newest, oldest, or due soon.
- **Due Date Urgency** — Assignments due today or overdue are pinned to the top with a red indicator.
- **Clickable Cards** — Clicking an assignment card navigates to the paper directly (3-dot menu kept for delete).
- **Search** — Search assignments by title or subject.
- **Mobile Bottom Navigation** — Responsive bottom tab bar for mobile screens.
- **User Profile in Topbar** — Shows logged-in user name with sign-out dropdown.

---

## Project Structure

```
client/                         → Next.js frontend
  src/
    app/
      assignments/              → List, create, and view paper pages
      auth/                     → Login and register pages
    components/
      layout/                   → Sidebar, TopBar, MobileNav
      assignments/              → Card, Grid, EmptyState, SearchFilter
      create-form/              → FileUpload, QuestionTypeList, etc.
      paper/                    → AIBanner, PaperHeader, SectionBlock, etc.
      ui/                       → Button, Counter, DropdownSelect
    lib/                        → Redux store, slices, API client, socket
    context/                    → AuthContext
    hooks/                      → useSocket
    types/                      → TypeScript interfaces

server/                         → Express backend
  src/
    config/                     → DB, Redis, BullMQ, env config
    controllers/                → Assignment and Auth controllers
    middleware/                  → JWT auth middleware
    models/                     → Mongoose schemas (Assignment, QuestionPaper, User)
    routes/                     → Express routes
    services/                   → LLM service (OpenRouter)
    jobs/                       → BullMQ worker
    validators/                 → Zod schemas
    ws/                         → WebSocket room management
    utils/                      → Prompt builder, LLM response parser
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/assignments` | List assignments (search, filter, sort) |
| POST | `/api/assignments` | Create assignment and start AI generation |
| GET | `/api/assignments/:id` | Get assignment details |
| DELETE | `/api/assignments/:id` | Delete an assignment |
| GET | `/api/assignments/:id/paper` | Get generated question paper |
| POST | `/api/assignments/:id/regenerate` | Regenerate the paper |

All `/api/assignments` routes require a valid JWT token in the `Authorization: Bearer <token>` header.
