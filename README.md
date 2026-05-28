# VedaAI - AI Assessment Creator

An AI-powered assessment creation tool that allows teachers to create assignments and generate structured question papers using LLM technology.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │Assignment │  │   Create     │  │    Output Page     │  │
│  │   List    │  │   Form       │  │  (Question Paper)  │  │
│  └────┬─────┘  └──────┬───────┘  └─────────┬─────────┘  │
│       │               │                     │            │
│       │    Redux Toolkit + WebSocket Client  │            │
└───────┼───────────────┼─────────────────────┼────────────┘
        │               │                     │
   REST API         REST API             WebSocket
        │               │                     │
┌───────┼───────────────┼─────────────────────┼────────────┐
│       ▼               ▼                     ▼            │
│  ┌─────────────────────────────────────────────────┐     │
│  │              Express.js API Server               │     │
│  │         (Routes + Controllers + Validation)      │     │
│  └──────────────────┬──────────────────────────────┘     │
│                     │                                     │
│          ┌──────────┼──────────┐                         │
│          ▼          ▼          ▼                         │
│     ┌────────┐ ┌────────┐ ┌────────────┐               │
│     │MongoDB │ │ Redis  │ │  BullMQ    │               │
│     │        │ │(Cache) │ │  (Queue)   │               │
│     └────────┘ └────────┘ └─────┬──────┘               │
│                                  │                       │
│                          ┌───────▼───────┐               │
│                          │  BullMQ Worker │               │
│                          │  (Groq LLM)   │               │
│                          └───────────────┘               │
│                    Backend (Node.js)                      │
└──────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS       |
| State      | Redux Toolkit                                           |
| Forms      | react-hook-form + Zod validation                        |
| Realtime   | Native WebSocket API                                    |
| Backend    | Express.js, TypeScript                                  |
| Database   | MongoDB (Mongoose)                                      |
| Cache      | Redis (ioredis)                                         |
| Queue      | BullMQ                                                  |
| AI         | Groq SDK (Llama 3.3 70B)                                |
| Infra      | Docker Compose (MongoDB + Redis)                        |

## Data Flow

1. Teacher fills the **Create Assignment** form with subject, question types, counts, marks, and instructions
2. Frontend sends `POST /api/assignments` to the backend
3. Backend validates input (Zod), saves assignment to MongoDB (status: `pending`), enqueues a BullMQ job
4. Backend returns `assignmentId` immediately; frontend opens a WebSocket subscription
5. BullMQ worker picks up the job, builds a structured prompt, calls Groq API
6. Worker parses the LLM JSON response, validates with Zod, saves `QuestionPaper` to MongoDB
7. Worker emits `generation-completed` via WebSocket
8. Frontend receives the event and renders the structured question paper

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for MongoDB + Redis)
- Groq API key ([Get one free](https://console.groq.com))

### 1. Clone the repository

```bash
git clone <repo-url>
cd vedaai-assessment
```

### 2. Start MongoDB & Redis

```bash
docker compose up -d
```

### 3. Backend setup

```bash
cd server
cp .env.example .env    # or create .env with values below
npm install
npm run dev
```

**Server `.env`:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:3000
```

### 4. Frontend setup

```bash
cd client
npm install
npm run dev
```

**Client `.env.local`:**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### 5. Open the app

Visit `http://localhost:3000`

## API Endpoints

| Method | Route                            | Description                          |
|--------|----------------------------------|--------------------------------------|
| GET    | `/api/assignments`               | List all assignments (search/filter) |
| POST   | `/api/assignments`               | Create assignment + enqueue AI job   |
| GET    | `/api/assignments/:id`           | Get assignment details               |
| DELETE | `/api/assignments/:id`           | Delete assignment                    |
| GET    | `/api/assignments/:id/paper`     | Get generated question paper         |
| POST   | `/api/assignments/:id/regenerate`| Re-trigger paper generation          |

## WebSocket Events

| Event                  | Direction       | Purpose                         |
|------------------------|-----------------|----------------------------------|
| `subscribe`            | Client → Server | Join room for an assignment ID   |
| `generation-started`   | Server → Client | Show processing state            |
| `generation-completed` | Server → Client | Paper is ready                   |
| `generation-failed`    | Server → Client | Show error + retry option        |

## Key Design Decisions

- **Normalized DB schema**: Assignment and QuestionPaper are separate models, enabling regeneration and versioning
- **BullMQ for async generation**: LLM calls are slow; the queue prevents API timeouts and enables retries
- **Redis caching**: Generated papers are cached in Redis (1h TTL) for fast repeat loads
- **Structured LLM output**: The prompt demands strict JSON; the parser validates with Zod and retries on malformed responses
- **Never render raw AI text**: All LLM output is parsed into typed data structures before display

## Bonus Features

- PDF export (browser print with print-optimized styles)
- Regenerate button on output page
- Redis caching for generated papers
- Real-time WebSocket updates during generation
- Mobile responsive design with bottom navigation
- Color-coded difficulty badges (Easy/Moderate/Challenging)
- Answer key generation
