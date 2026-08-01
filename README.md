# AI Quote Generator

This is a production-ready, fully functional full-stack AI Quote Generator application utilizing React, Express, and the Groq SDK with Llama 3.3.

---

## Technical Features
- **Frontend:** React, Vite, Axios, Tailwind CSS, html2canvas (for download screenshots), Copy/Share helpers.
- **Backend:** Node.js, Express, Helmet (security headers), CORS policies.
- **AI Integration:** Groq SDK utilizing `llama-3.3-70b-versatile` with offline demo/mock fallbacks.

---

## Active Local Servers
- **Backend API:** [http://localhost:5000](http://localhost:5000) (Task ID: `task-684`)
- **Frontend App:** [http://localhost:5173](http://localhost:5173) (Task ID: `task-751`)

---

## Installation & Setup

### 1. Configure Environment Variables
Create a file named `.env` in the backend directory (`/backend/.env`):
```env
PORT=5000
GROQ_API_KEY=your_actual_groq_api_key
CLIENT_URL=http://localhost:5173
```
*(If no GROQ_API_KEY is configured, the system automatically falls back to seeded mock quote responses).*

### 2. Start Backend
Open a terminal window and run:
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
Open a second terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
Navigate to [http://localhost:5173](http://localhost:5173) to run the application.