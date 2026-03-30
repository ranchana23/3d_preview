const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const STATIC_DIR = __dirname;

const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

function followRedirects(targetUrl, res, remainingRedirects = 5) {
    if (remainingRedirects <= 0) {
        res.writeHead(502);
        res.end('Too many redirects');
        return;
    }
    https.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
            proxyRes.resume();
            followRedirects(proxyRes.headers.location, res, remainingRedirects - 1);
            return;
        }
        res.writeHead(proxyRes.statusCode, {
            'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400',
        });
        proxyRes.pipe(res);
    }).on('error', (e) => {
        res.writeHead(502);
        res.end('Proxy error: ' + e.message);
    });
}

http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);

    // Proxy endpoint: /drive-font?id=XXXXX
    if (parsed.pathname === '/drive-font') {
        const fileId = parsed.query.id;
        if (!fileId) { res.writeHead(400); res.end('Missing id'); return; }
        const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
        followRedirects(driveUrl, res);
        return;
    }

    // Static file serving
    let filePath = path.join(STATIC_DIR, parsed.pathname === '/' ? 'multiple.html' : parsed.pathname);
    filePath = decodeURIComponent(filePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
        });
        fs.createReadStream(filePath).pipe(res);
    });
}).listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
