import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON text (since frontend sends text/plain)
  app.use(express.text());
  app.use(express.json());

  // API Route for proxying the Google Apps Script Web App
  app.post("/api/archive", async (req, res) => {
    try {
      const fallbackUrl = 'https://script.google.com/macros/s/AKfycbzO_u8IOGiW_OTjAGeiGX7hvyQCa8wup9GNjoViDh25MLRdseDX3_jIQhzpErDfscvf/exec';
      const archiveUrl = process.env.VITE_APPS_SCRIPT_WEB_APP_URL || fallbackUrl;
      
      if (!archiveUrl) {
        res.status(500).json({ success: false, message: "Configuration Error: Missing VITE_APPS_SCRIPT_WEB_APP_URL" });
        return;
      }

      // Check if body is a string (text/plain) or object (express.json)
      let payload = req.body;
      if (typeof payload === 'object') {
          payload = JSON.stringify(payload);
      }
      
      const response = await fetch(archiveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: payload,
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      const headersObj: Record<string, string> = {};
      response.headers.forEach((val, key) => headersObj[key] = val);

      if (contentType.includes('application/json')) {
        try {
          return res.json(JSON.parse(text));
        } catch (e) {
          // Fall back to raw response handling
        }
      }

      // Return raw response details
      return res.status(200).json({
        success: false,
        message: text.toLowerCase().includes('<!doctype html>') 
          ? "Google Apps Script returned an HTML page. Ensure the Web App is deployed with 'Who has access: Anyone' (not 'Anyone with Google account')."
          : "Google Apps Script returned a non-JSON response.",
        statusCode: response.status,
        responseHeaders: headersObj,
        rawBody: text.substring(0, 500) // Truncate for display
      });
    } catch (err: any) {
      console.error('Error proxying to Apps Script:', err);
      res.status(500).json({ success: false, message: err.message || 'Proxy Error' });
    }
  });
  
  app.get("/api/archive/logs", async (req, res) => {
    try {
      const fallbackUrl = 'https://script.google.com/macros/s/AKfycbzO_u8IOGiW_OTjAGeiGX7hvyQCa8wup9GNjoViDh25MLRdseDX3_jIQhzpErDfscvf/exec';
      const archiveUrl = process.env.VITE_APPS_SCRIPT_WEB_APP_URL || fallbackUrl;
      const response = await fetch(`${archiveUrl}?action=getLogs`);
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
         const data = await response.json();
         return res.json(data);
      }
      return res.json([]);
    } catch (e) {
      console.error(e);
      res.json([]);
    }
  });

  app.get("/api/archive/status", (req, res) => {
    const fallbackUrl = 'https://script.google.com/macros/s/AKfycbzO_u8IOGiW_OTjAGeiGX7hvyQCa8wup9GNjoViDh25MLRdseDX3_jIQhzpErDfscvf/exec';
    const envUrl = process.env.VITE_APPS_SCRIPT_WEB_APP_URL;
    const archiveUrl = envUrl || fallbackUrl;
    res.json({ 
      configured: !!archiveUrl, 
      url: archiveUrl || '',
      source: envUrl ? 'env' : 'fallback',
      hasEnvVar: !!envUrl
    });
  });

  // Netlify function local proxy
  app.post("/.netlify/functions/send-email", async (req, res) => {
    try {
      const { handler } = await import("./netlify/functions/send-email.ts");
      
      let payload = req.body;
      if (typeof payload === 'object') {
          payload = JSON.stringify(payload);
      }
      
      const event = {
        httpMethod: req.method,
        body: payload,
        headers: req.headers,
      };
      
      const response = await handler(event as any, {} as any);
      
      if (response && response.statusCode) {
        res.status(response.statusCode);
        if (response.headers) {
          for (const [key, value] of Object.entries(response.headers)) {
             res.setHeader(key, value as string);
          }
        }
        res.send(response.body);
      } else {
        res.status(500).send("Invalid response from Netlify function");
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).send(e.message);
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
