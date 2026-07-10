# InspirAI - Advanced AI Quote Generator

InspirAI is a premium, full-stack AI-powered quote generator. Select topics, set a vocal tone (e.g., Inspirational, Witty, Philosophical), specify lengths, and generate beautiful, unique quotes powered by **Groq Llama 3.3-70B**.

## Features

- **User Authentication**: Secure Sign-up, Login, and JWT session handling.
- **AI Quote Generation**: Llama 3.3-70B-Versatile integration via Groq API.
- **Quote Management**:
  - Save generated quotes to MongoDB.
  - View full chronological quote history.
  - Heart and save favorite quotes.
  - Search, filter by topic, and filter by tone.
- **Interactive Tools**:
  - **SVG Template Download**: Generates a stylized card and downloads it as an SVG image.
  - **Text-to-Speech (TTS)**: Reads quotes aloud using standard speech synthesis.
  - **Copy & Share**: Clipboard integration and Web Share API.
- **User Dashboard & Analytics**: Dynamic metrics tracking total quotes, favorites, and topic/tone spectrums.
- **Design & Themes**:
  - Glassmorphic panels with gradient highlights.
  - Fully responsive layout.
  - Fluid light and dark mode toggling.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router DOM, React Icons, React Toastify.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Express Validator.
- **Database**: MongoDB (Mongoose).
- **AI**: Groq Cloud API (`llama-3.3-70b-versatile`).

---

## Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your system.

### 2. Configure Environment Variables
Create or open the `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/quote_generator
JWT_SECRET=super_secret_jwt_token_key_change_me_in_prod
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
```
*Note: If no `GROQ_API_KEY` is provided, the application will gracefully fall back to generating pre-configured inspirational mock quotes so you can still test it.*

### 3. Install Dependencies
In the root directory, run:
```bash
npm run install-all
```

---

## Running the Application

### Option A: Combined Dev Server (Concurrently)
To run both the React Vite client (port 5173 with proxy) and the Node API server (port 5000) concurrently in development:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Option B: Single localhost Link (Production Mode)
To compile the frontend and host it directly from the backend server on a **single port (5000)**:
1. Build the React frontend:
   ```bash
   npm run build
   ```
2. Start the Express server:
   ```bash
   npm start
   ```
3. Open **[http://localhost:5000](http://localhost:5000)**. The Express backend will serve both the API and the React web application on this single port!
