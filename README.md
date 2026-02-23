# AI Secure Docs

Secure AI-powered document management system built with React, Firebase, and GitHub Models (Phi-4).

## 🚀 Features

- **Authentication**: Email/password login with Firebase Auth
- **Role-Based Access**: Users assigned "member" role automatically
- **AI Summarization**: Real-time document summarization using Microsoft Phi-4 via GitHub Models API
- **Secure Architecture**: Protected routes, audit logging, Firestore security rules
- **Real-time Updates**: Documents sync instantly across sessions

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Firebase (Auth, Firestore) |
| AI/ML | GitHub Models API (Phi-4-mini) |
| Security | Protected routes, audit logs |

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-secure-docs.git
cd ai-secure-docs

# Install dependencies
npm install

# Create .env file
echo "VITE_GITHUB_TOKEN=your_github_token_here" &gt; .env

# Run development server
npm run dev
