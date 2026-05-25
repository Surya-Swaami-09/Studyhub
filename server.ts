import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Simple JSON Database persistence engine for student accounts & progress saving across devices
const DB_FILE = path.join(process.cwd(), "users_db.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: {} };
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Local JSON database read error:", e);
    return { users: {} };
  }
}

function writeDB(dbData: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (e) {
    console.error("Local JSON database write error:", e);
  }
}

let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: User Signup
  app.post("/api/auth/signup", (req, res) => {
    try {
      const { email, password, progress } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const dbData = readDB();
      const normalizedEmail = email.toLowerCase().trim();

      if (dbData.users[normalizedEmail]) {
        return res.status(400).json({ error: "An account already exists with this email address." });
      }

      dbData.users[normalizedEmail] = {
        email: normalizedEmail,
        password: password,
        progress: progress || {}
      };

      writeDB(dbData);
      res.json({ email: normalizedEmail, progress: dbData.users[normalizedEmail].progress });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "External system database error." });
    }
  });

  // API Route: User Login
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const dbData = readDB();
      const normalizedEmail = email.toLowerCase().trim();
      const user = dbData.users[normalizedEmail];

      if (!user || user.password !== password) {
        return res.status(400).json({ error: "Invalid email address or secure password." });
      }

      res.json({ email: normalizedEmail, progress: user.progress || {} });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to authenticate your session." });
    }
  });

  // API Route: Sync User Progress
  app.post("/api/user/progress", (req, res) => {
    try {
      const { email, progress } = req.body;
      if (!email || !progress) {
        return res.status(400).json({ error: "Email and study progress details are required for synchronization." });
      }

      const dbData = readDB();
      const normalizedEmail = email.toLowerCase().trim();
      const user = dbData.users[normalizedEmail];

      if (!user) {
        return res.status(404).json({ error: "Active profile account not found." });
      }

      user.progress = progress;
      writeDB(dbData);

      res.json({ success: true, progress: user.progress });
    } catch (error: any) {
      console.error("Progress sync error:", error);
      res.status(500).json({ error: "Progress synchronization failed." });
    }
  });

  // API Route: AI Assistant
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // API Route: Generate Flashcards
  app.post("/api/ai/flashcards", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text content is required" });
      }

      const client = getGeminiClient();
      const systemPrompt = "You are an expert educator. Extract 3-5 high-yield learning flashcards as a JSON array where each item has 'question' and 'answer' keys. Return valid JSON only, no markdown wrappers.";
      
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Text: ${text}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "[]";
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error("Gemini Flashcards API Error:", error);
      res.json([
        { question: "Fallback: Study Tip", answer: "Study key concepts systematically and try generating again with an active API Key." }
      ]);
    }
  });

  // API Route: Explain a question
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { question, subject, context } = req.body;
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `I need an educational explanation for this query.
Subject: ${subject || 'General'}
Question: ${question}
Context details: ${context || ''}

Provide a deep pedagogical breakdown:
1. Core Concept explanation
2. Step-by-Step solution
3. Standard exam test tip or formula recap.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Explain API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate explanation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
