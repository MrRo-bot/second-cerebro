# Second Cerebro

**An AI-Powered Second Brain** — Built with modern web technologies to capture, organize, and intelligently interact with your personal knowledge.

Inspired by Recall (getrecall.ai), Notion, and Obsidian, Second Cerebro combines a beautiful block-style editor with powerful semantic search, AI-generated insights, and active recall features — all while demonstrating real cloud and AI integration.

![Second Cerebro Hero]()

## ✨ Key Features

- **One-Click URL Capture & AI Summarization** — Paste any `WebPage Link`, `YouTube Video Link`, or files like `PDF` and `MS Word Docs` and get instant intelligent summaries powered by `Groq + GEMINI + openai/gpt-oss-120b`

- **Semantic Search & Hybrid Vector Search** — Find anything instantly using `MongoDB Atlas Vector Search + Nomic embeddings`

- **Chat with Your Second Brain** — Ask questions across all your saved knowledge with contextual RAG (Retrieval-Augmented Generation)

- **Self-Organizing Knowledge Graph** — Automatically discover connections between notes with vector similarity

- **Obsidian-style Markdown Editor** — Rich writing experience with `TipTap Editor`

- **Auto Tagging & Related Notes** — Smart categorization and intelligent suggestions

- **Beautiful Graph Visualization** — Explore your knowledge network visually

## 🛠️ Tech Stack

### Frontend & Framework

- **Next.js 16** (`App Router`, `Partial Prerendering`, `Turbopack`)

- **React 19** (`Server Actions`, `useActionState`, `useOptimistic`, `React Compiler`)

- **TypeScript**

- **Tailwind CSS**

- **shadcn/ui**

### Backend & Database

- **MongoDB Atlas** with **Vector Search** (pure MongoDB driver — no Mongoose or Prisma)

- **Server Actions** for all mutations and AI calls

### AI Integration (Free & Fast)

- **Groq** `(openai/gpt-oss-120b)` — Fast inference for summarization, quizzes, tagging, and RAG chat

- **Embedding with GEMINI** — High-quality open embeddings for semantic search

### Authentication

- **better-auth** (Email + Password + Google OAuth)

### Deployment Ready

- Optimized for **Vercel** (frontend) with easy integration to AWS services

- Designed with cloud architecture in mind (MongoDB Atlas on AWS + Groq)

## 🚀 Why This Project Stands Out

This is not just another note-taking app. Second Cerebro demonstrates:

- Deep understanding of **modern React & Next.js** (React 19 + Next.js 16 features)

- Real **AI integration** using fast, cost-effective open models (Groq + Nomic)

- Production-grade **vector search** with MongoDB Atlas

- Clean architecture using **Server Components + Server Actions** with minimal client state

- Thoughtful UX inspired by leading second-brain tools like Recall

Perfect showcase for roles involving **Full-Stack**, **AI Engineering**, or **Cloud-Native Development**.

## 📸 Screenshots

## 🏗️ Architecture Highlights

- **Server-first approach** with heavy use of Server Actions and React 19 primitives
- **Optimistic updates** for smooth UX without blocking the UI
- **Hybrid semantic + keyword search**
- **Private AI inference** via Groq (no data leakage concerns)
- Clean separation between UI state and persistent data (MongoDB)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas cluster with Vector Search index enabled
- Groq API key
- Gemini API key
- Google OAuth credentials (for better-auth)

### Installation

## 📜 Copy environment variables

```text
MONGODB_URI = your_mongodb_atlas_connection_string
GROQ_API_KEY = your_groq_api_key
GEMINI_API_KEY = your_gemini_api_key
GOOGLE_CLIENT_ID = ...
GOOGLE_CLIENT_SECRET = ...
NEXT_PUBLIC_APP_URL = production_url
NINJA_QUOTES_API_KEY = ...
```

## 🛑 Issues faced

- **Cookie transfer from server to client** — Used `auth-client` instead of `auth`

- **AI embedding issue** — Model in `Groq` expired and had to choose new one later

- **AI semantic search issue** — Huggingface is not enough so `GEMINI` is the next best option

- **Proxy wasn't working** - Location of proxy file was wrong

- **Update flow issues** - Improper flow from text to markdown

- **Error handling issues in server** - Created proper return type object

- **Search was slow** - `Semantic + keyword + recency score` (100m docs in 100ms) + `vector` (HNSW(Hierarical navigable small world)), `rankFusion keyword search`, overall 10-50 million notes within 2 seconds

- **Markdown editor issues** - Improper tiptap config & options

- **Streamable text in AI chat** - Required `ai-sdk` package for it

- **Visual error management** - Error management with normalizeError utility function

- **Refresh loop in /dashboard** - Fixed proxy file and cache recheck issue.

## 📄 License

GNU General Public License

"
Made with ❤️ for showcasing modern full-stack + AI development
If you like this project, feel free to ⭐ the repo
"
