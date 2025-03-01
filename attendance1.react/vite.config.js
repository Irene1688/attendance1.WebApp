import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    //host: "0.0.0.0",
    port: 5173,
    //strictPort: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('[Vite Proxy] Before rewrite:', path);
          const rewritten = path.replace(/^\/api/, '');
          console.log('[Vite Proxy] After rewrite:', rewritten);
          return rewritten;
        },
        secure: false,
        configure: (proxy, options) => {
          proxy.options = {
            ...proxy.options,
            rejectUnauthorized: false,
            timeout: 10000,
            proxyTimeout: 10000,
            keepAlive: false
          };

          proxy.on('error', (err, req, res) => {
            console.log('[Vite Proxy] Error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Vite Proxy] Request:', {
              originalUrl: req.url,
              targetUrl: proxyReq.path,
              method: req.method,
              headers: proxyReq.getHeaders(),
            });
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[Vite Proxy] Response status:', proxyRes.statusCode);
            console.log('[Vite Proxy] Response headers:', proxyRes.headers);

            if (proxyRes.statusCode === 401 && proxyRes.headers['token-expired'] === 'true') {
              console.log('[Vite Proxy] Token expired response');
              Object.keys(proxyRes.headers).forEach(key => {
                res.setHeader(key, proxyRes.headers[key]);
              });
              
              res.statusCode = 401;
              
              res.end(JSON.stringify({
                status: 401,
                message: "Token has expired"
              }));
              return;
            }

            if (proxyRes.statusCode === 403 && proxyRes.headers['forbidden'] === 'true') {
              console.log('[Vite Proxy] Forbidden response');
              Object.keys(proxyRes.headers).forEach(key => {
                res.setHeader(key, proxyRes.headers[key]);
              });
              
              res.statusCode = 403;
              
              res.end(JSON.stringify({
                status: 403,
                message: "You do not have permission to access this resource"
              }));
              return;
            }

            const chunks = [];
            
            proxyRes.on('data', (chunk) => {
              chunks.push(chunk);
            });

            proxyRes.on('end', () => {
              if (chunks.length === 0) {
                console.log('[Vite Proxy] Empty response body');
                return;
              }

              const body = Buffer.concat(chunks).toString('utf8');
              try {
                const parsedBody = JSON.parse(body);
                console.log('[Vite Proxy] Response:', {
                  statusCode: proxyRes.statusCode,
                  headers: proxyRes.headers,
                  body: parsedBody
                });
              } catch (e) {
                console.log('[Vite Proxy] Response:', {
                  statusCode: proxyRes.statusCode,
                  headers: proxyRes.headers,
                  body: body
                });
              }
            });

            proxyRes.on('error', (err) => {
              if (err.code === 'ECONNRESET' && proxyRes.statusCode === 401) {
                console.log('[Vite Proxy] Expected connection reset for 401 response');
                return;
              }
              console.error('[Vite Proxy] Response Error:', err);
            });
          });
        },
        logger: {
          log: (...args) => console.log('[Vite Proxy]', ...args),
          debug: (...args) => console.log('[Vite Proxy Debug]', ...args),
          info: (...args) => console.log('[Vite Proxy Info]', ...args),
          warn: (...args) => console.warn('[Vite Proxy Warn]', ...args),
          error: (...args) => console.error('[Vite Proxy Error]', ...args)
        }
      }
    }
  }
})