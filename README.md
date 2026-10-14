# CogniSync ⚡
### Neural Task Synthesizer & Cognitive Energy Management

CogniSync is an AI-powered cognitive overload decoupler built to help knowledge workers, developers, and ADHD brains overcome overwhelm. Instead of drowning in endless to-do lists, CogniSync converts chaotic thoughts into a single, focused next step matched to your current cognitive energy bandwidth.

---

## ✨ Features

- 🧠 **AI Brain Dump**: Paste raw, messy, stressed-out mental overflow. CogniSync extracts exactly 3 high-impact, actionable tasks with associated cognitive load ratings.
- ⚡ **Energy-Aware Scheduling**: Classifies tasks by cognitive demand (**High**, **Medium**, **Low**) so you can match actions to your mental capacity.
- 🎯 **Single-Task Focus Mode**: Eliminates decision paralysis by presenting **strictly one active card** at a time with an instant completion cycle.
- ☁️ **Supabase Integration**: Optional cloud sync and authentication with PostgreSQL schema support, fully functioning in local offline mode without mandatory credentials.
- 🎨 **Radical Dark Cyber UI**: Crafted with modern dark-mode aesthetic, emerald neon glow micro-interactions, responsive typography, and celebratory tactile feedback.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: Google Gemini API (with resilient heuristic fallback for offline/demo reliability)
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth, Row Level Security, Realtime Database)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested with v24)
- **npm** or **yarn**

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/brahmam7707-ship-it/cognisync.git
cd cognisync
npm install
```

### 3. Environment Setup (Optional)
Copy the example environment configuration:

```bash
cp .env.example .env
```

Add your Supabase and Gemini credentials (if desired):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*Note: CogniSync includes offline demo parsers and client-side key inputs, so it runs completely out of the box without any initial configuration!*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Privacy

- All sensitive keys (`.env`, secrets) are strictly ignored by `.gitignore`.
- API keys entered via the UI are stored exclusively in your local browser storage (`localStorage`) and never transmitted to third-party tracking servers.

---

## 📄 License

MIT License &copy; 2026 CogniSync Team. Built for high-pressure hackathons.

