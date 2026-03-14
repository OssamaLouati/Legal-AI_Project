# Legal AI — Automated Legal Document Analysis Platform

Full-stack application for contract Q\&A and clause understanding.

- **client/**: Next.js + NextAuth (Google OAuth) UI
- **server/**: Flask API (Gunicorn) serving ML/NLP endpoints

## Quickstart (Docker)

### 1) Prerequisites

- Docker Desktop **or** Podman (this repo currently uses `podman-compose` on macOS)

### 2) Configure environment

Create a local env file (never commit secrets):

```bash
cp client/.env.local.example client/.env
```

Edit `client/.env` and set at least:

- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=...` (generate with `openssl rand -base64 32`)
- `GOOGLE_ID=...`
- `GOOGLE_SECRET=...`

Also:

- `NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5001`

### 3) Build & run

```bash
docker compose up -d --build
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:5001/questionsshort

## Local dev (without Docker)

### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn -b 127.0.0.1:5001 app:app --reload
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Key Features

- Contract upload + question selection
- Reading comprehension model (SQuAD-style)
- Paraphrasing (T5-based)
- Sentiment analysis (TextBlob)

## Disclaimer

This project is provided for research/education and is **not** a substitute for professional legal advice.
