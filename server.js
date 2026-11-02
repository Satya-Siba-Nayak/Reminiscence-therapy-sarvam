import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./worker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    const fullUrl = `http://${req.headers.host || `localhost:${PORT}`}${req.url}`;

    if (req.url.startsWith("/api/")) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const bodyBuffer = Buffer.concat(chunks);

      const webReq = new Request(fullUrl, {
        method: req.method,
        headers: req.headers,
        body:
          req.method !== "GET" && req.method !== "HEAD" ? bodyBuffer : undefined,
      });

      const webRes = await worker.fetch(webReq, {
        SARVAM_API_KEY: process.env.SARVAM_API_KEY,
      });

      res.writeHead(
        webRes.status,
        Object.fromEntries(webRes.headers.entries())
      );
      const resBuffer = Buffer.from(await webRes.arrayBuffer());
      res.end(resBuffer);
      return;
    }

    let safePath = req.url.split("?")[0];
    if (safePath === "/") safePath = "/index.html";
    const filePath = path.join(PUBLIC_DIR, path.normalize(safePath));

    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    res.end(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(err.message || "Internal Server Error");
    }
  }
});

server.listen(PORT, () => {
  console.log(
    `\n✦ Smriti (Sarvam AI Reminiscence Therapy Portal) running at http://localhost:${PORT}\n`
  );
});
