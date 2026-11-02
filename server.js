'use strict';
/*
 * Quiz-tavle server
 * - Viser selve quizzen fra ./public
 * - Gemmer delte quizzer (inkl. sange) og giver korte links: /q/<id>
 *
 * Data gemmes i DATA_DIR. På Railway peger den automatisk på dit Volume
 * (RAILWAY_VOLUME_MOUNT_PATH). Uden Volume gemmes i ./data, som slettes
 * ved hver ny udrulning.
 */
const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const VOLUME = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || '';
const DATA_DIR = path.join(VOLUME || path.join(__dirname, 'data'), 'quizzes');
const PERSISTENT = !!VOLUME;
const MAX_BODY = 120 * 1024 * 1024; // 120 MB (plads til en del sange)

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.txt': 'text/plain; charset=utf-8',
};

fs.mkdirSync(DATA_DIR, { recursive: true });

const ID_RE = /^[A-Za-z0-9]{6,16}$/;
function newId() {
  const abc = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let id = '';
  for (const b of bytes) id += abc[b % abc.length];
  return id;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(body);
}
const json = (res, status, obj) => send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8' });

async function serveFile(res, file) {
  try {
    const data = await fsp.readFile(file);
    send(res, 200, data, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  } catch (e) {
    send(res, 404, 'Ikke fundet', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Quizzen er for stor (maks. 120 MB)'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const p = decodeURIComponent(url.pathname);

    // --- API ---
    if (p === '/api/health') return json(res, 200, { ok: true, persistent: PERSISTENT });

    if (p === '/api/quiz' && req.method === 'POST') {
      const body = await readBody(req);
      let data;
      try { data = JSON.parse(body.toString('utf8')); } catch (e) { return json(res, 400, { error: 'Ugyldig quiz' }); }
      if (!data || !data.config || !Array.isArray(data.config.categories)) return json(res, 400, { error: 'Ugyldig quiz' });
      const id = newId();
      const doc = { format: 'quiztavle', version: 2, created: new Date().toISOString(), config: data.config, audio: data.audio || {} };
      await fsp.writeFile(path.join(DATA_DIR, id + '.json'), JSON.stringify(doc));
      return json(res, 201, { id, persistent: PERSISTENT });
    }

    const mApi = /^\/api\/quiz\/([^/]+)$/.exec(p);
    if (mApi && req.method === 'GET') {
      const id = mApi[1];
      if (!ID_RE.test(id)) return json(res, 404, { error: 'Findes ikke' });
      try {
        const data = await fsp.readFile(path.join(DATA_DIR, id + '.json'));
        return send(res, 200, data, { 'Content-Type': 'application/json; charset=utf-8' });
      } catch (e) { return json(res, 404, { error: 'Quizzen findes ikke (længere)' }); }
    }

    // --- Sider ---
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Metode ikke tilladt');
    if (p === '/' || /^\/q\/[^/]+\/?$/.test(p)) return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));

    const file = path.normalize(path.join(PUBLIC_DIR, p));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 403, 'Ingen adgang');
    return serveFile(res, file);
  } catch (e) {
    console.error(e);
    return json(res, e.status || 500, { error: e.message || 'Serverfejl' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz-tavle kører på port ${PORT}. Data: ${DATA_DIR} (${PERSISTENT ? 'Volume – gemmes permanent' : 'midlertidig – tilføj et Volume på Railway'})`);
});
