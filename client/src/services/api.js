import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aqg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear auth and redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("aqg_token");
      localStorage.removeItem("aqg_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
};

// ── Chat ──────────────────────────────────────────────
export const chatAPI = {
  create: (title) => api.post("/chat/create", { title }),
  getAll: () => api.get("/chat"),
  getById: (id) => api.get(`/chat/${id}`),
  sendMessage: (id, content) => api.post(`/chat/${id}/message`, { content }),
  delete: (id) => api.delete(`/chat/${id}`),
};

// ── Quote ─────────────────────────────────────────────
export const quoteAPI = {
  generate: (data) => api.post("/quote/generate", data),
  explain: (id) => api.post(`/quote/${id}/explain`),
  getHistory: (params) => api.get("/quote/history", { params }),
  toggleFavorite: (id) => api.post(`/quote/${id}/favorite`),
  delete: (id) => api.delete(`/quote/${id}`),
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

// ── Standalone helper functions (used by components directly) ─────
export async function generateQuote(category, language, length) {
  try {
    const res = await api.post("/quote/generate", { category, mood: "Inspired", language, length });
    return res.data;
  } catch (err) {
    // If the server is down, return a graceful error
    throw new Error(err.response?.data?.message || "Could not connect to server. Please ensure the backend is running.");
  }
}

export async function sendChatMessage(history) {
  try {
    // The chat endpoint expects a conversation history array
    const res = await api.post("/chat/message", { history });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Could not connect to server. Please ensure the backend is running.");
  }
}

export default api;