import axios from "axios";

const API = "http://localhost:5000/api";

const client = axios.create({
  baseURL: API,
  timeout: 15000
});

export const quoteAPI = {
  generate: async (params) => {
    try {
      const res = await client.post("/quotes/generate", params);
      return res.data;
    } catch (error) {
      if (!error.response) {
        throw new Error("Backend is not running.");
      }
      throw new Error(error.response.data?.message || "Groq API Error");
    }
  },
  checkHealth: async () => {
    const res = await client.get("/health");
    return res.data;
  }
};
