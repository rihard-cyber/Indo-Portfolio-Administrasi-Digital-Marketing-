const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
    // Prevent directory traversal attacks and decode URL-encoded characters (like spaces %20)
    let safeUrl = decodeURIComponent(req.url.split('?')[0]);
    
    // API endpoint to copy generated mockup images
    if (safeUrl === '/api/copy-images') {
        const srcDir = `C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\ce346473-acac-4125-9a40-1a57283da013`;
        const destDir = path.join(__dirname, 'images');
        
        const files = [
            { src: 'ai_english_project_1779020029846.png', dest: 'ai-english.png' },
            { src: 'secure_parking_project_1779020047263.png', dest: 'secure-parking.png' },
            { src: 'hris_presensi_project_1779020067305.png', dest: 'hris-presensi.png' },
            { src: 'digital_marketing_project_1779020082512.png', dest: 'digital-marketing.png' },
            { src: 'modern_portfolio_project_1779020100509.png', dest: 'modern-portfolio.png' }
        ];
        
        try {
            // Ensure images folder exists
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            files.forEach(f => {
                const srcPath = path.join(srcDir, f.src);
                const destPath = path.join(destDir, f.dest);
                fs.copyFileSync(srcPath, destPath);
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'All mockup images copied successfully!' }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    let filePath = path.join(__dirname, safeUrl === '/' ? 'index.html' : safeUrl);
    
    // Check if path is within workspace
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 Forbidden</h1>', 'utf-8');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', '==================================================');
    console.log('\x1b[32m%s\x1b[0m', `  🚀 Portfolio Server is live at http://localhost:${PORT}/`);
    console.log('\x1b[36m%s\x1b[0m', '==================================================');
    console.log('  Press Ctrl+C to stop the server.');
    console.log('');
});
