# AI Secure Docs

> A secure, AI-powered document management system built with React, Firebase, and multi-provider LLM integration (Gemini / OpenRouter / GitHub Models).

**Live Demo:** [ai-secure-docs.vercel.app](https://ai-secure-docs.vercel.app/)

---

## Screenshots

| Login | Register |
|:-----:|:--------:|
| ![Login](https://github.com/user-attachments/assets/974d1263-1d44-46f7-9b30-df612c465f79) | ![Register](https://github.com/user-attachments/assets/34d76332-bab6-4271-ac0b-4ff24479ac2e) |

| Dashboard | Add Document |
|:---------:|:------------:|
| ![Dashboard](https://github.com/user-attachments/assets/6bc6bff7-dbf0-4d49-bb18-70e97e0045f6) | ![Add Document](https://github.com/user-attachments/assets/75ba569c-cf85-4508-83cd-12d74f3141d1) |

| Document Detail |
|:---------------:|
| ![Document Detail](https://github.com/user-attachments/assets/b0449b9b-77d1-4077-aa75-3cd9000d7532) |
## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Email/password login & registration via Firebase Auth |
| **Role-Based Access** | Users assigned "member" role; Firestore rules enforce per-user isolation |
| **AI Summarization** | Automatic document summaries via server-side API (Gemini -> OpenRouter -> GitHub Models fallback) |
| **Audit Logging** | Every create/update/delete action is logged to a top-level `auditLogs` collection |
| **Real-Time Sync** | Documents update instantly across sessions via Firestore `onSnapshot` |
| **Protected Routes** | `ProtectedRoute` component gates all authenticated pages |
| **Shared Navbar** | Reusable `Navbar` component used across Dashboard, AddDocument, DocumentDetail |
| **Serverless Backend** | Vercel API route (`/api/summarize`) keeps all API keys server-side |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend / API | Vercel Serverless Functions (Node.js) |
| Database | Firebase Firestore (Spark free plan) |
| Auth | Firebase Authentication |
| AI / LLM | Google Gemini Flash, OpenRouter (Mistral 7B free), GitHub Models (Phi-4) |
| Security | Firestore rules, env vars, server-side API keys |


## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- A Firebase project (free Spark plan)
- (Optional) API keys for Gemini / OpenRouter / GitHub Models

### Installation

```bash
git clone https://github.com/RashfiTabassum/ai-secure-docs.git
cd ai-secure-docs
npm install
```

### Environment Variables

```bash
cp .env.example .env
# Fill in your Firebase config values
```

### Development

```bash
npm run dev
```

### Deploy to Vercel (free)

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY` (get free at [aistudio.google.com](https://aistudio.google.com))
   - `OPENROUTER_API_KEY` (get free at [openrouter.ai](https://openrouter.ai))
   - `GITHUB_TOKEN` (GitHub PAT with models scope)
4. Deploy - Vercel auto-detects Vite and creates the `/api/summarize` endpoint

### Firestore Rules

Deploy security rules to Firebase:

```bash
npx firebase-tools deploy --only firestore:rules
```

## Security Model

- **Client-side:** Firebase Auth tokens; Firestore rules enforce `request.auth.uid == userId`
- **Server-side:** All LLM API keys stored as Vercel env vars (never sent to browser)
- **Audit trail:** Every document action logged with userId + timestamp
- **Env vars:** Firebase config read from `import.meta.env` with hardcoded fallbacks for dev

## License

MIT
