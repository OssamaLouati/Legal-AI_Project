# Contributing

Thanks for your interest in contributing to **Legal AI**.

## Project structure

- `client/` — Next.js (UI) + NextAuth
- `server/` — Flask API (served by Gunicorn in Docker)

## Development setup

### Option A: Docker (recommended)

1. Create the env file:

```bash
cp client/.env.local.example client/.env
```

2. Start services:

```bash
docker compose up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001/questionsshort

### Option B: Local (no Docker)

Backend:

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn -b 127.0.0.1:5001 app:app --reload
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Coding guidelines

- Keep changes small and focused.
- Prefer TypeScript types over `any` when touching TS/TSX files.
- Do not commit secrets:
  - never commit `client/.env` / `.env.local`

## Submitting changes

1. Create a branch:

```bash
git checkout -b chore/my-change
```

2. Make changes and run a quick check:

```bash
cd client && npm run build
```

3. Commit using clear messages:

- `feat(client): ...`
- `fix(server): ...`
- `chore: ...`

4. Open a Pull Request.
