import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Development middleware to serve /api serverless functions during local 'vite' dev
const apiServerlessDevPlugin = (): Plugin => ({
  name: 'api-serverless-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }

      try {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = urlObj.pathname;

        let handlerModule: any = null;
        if (pathname === '/api/referral/validate') {
          handlerModule = await server.ssrLoadModule('/api/referral/validate.ts');
        } else if (pathname === '/api/referral/order') {
          handlerModule = await server.ssrLoadModule('/api/referral/order.ts');
        } else if (pathname === '/api/admin/referral') {
          handlerModule = await server.ssrLoadModule('/api/admin/referral.ts');
        }

        if (handlerModule?.default) {
          // Read request body if present
          let bodyData: any = null;
          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks).toString();
            try {
              bodyData = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              bodyData = rawBody;
            }
          }

          // Mock Vercel req/res adapter
          const queryParams: Record<string, string> = {};
          urlObj.searchParams.forEach((val, key) => {
            queryParams[key] = val;
          });

          const mockReq = Object.assign(req, {
            query: queryParams,
            body: bodyData,
          });

          const mockRes = Object.assign(res, {
            status(statusCode: number) {
              res.statusCode = statusCode;
              return mockRes;
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return mockRes;
            },
            send(data: any) {
              res.end(data);
              return mockRes;
            },
          });

          await handlerModule.default(mockReq, mockRes);
          return;
        }

        return next();
      } catch (err) {
        console.error('Error in Vite API dev middleware:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal API middleware error', details: String(err) }));
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiServerlessDevPlugin()],
});
