import http from 'node:http';

// Railway exposes a single TLS-terminated port. The launch endpoint is
// internet-reachable but server-authenticated by the control handler. It is
// never authorized by browser cookies. The internal listeners stay loopback.
export function createIngress({ service, gatewayOrigin }) {
  const expectedHost = new URL(gatewayOrigin).host;
  const reject = (res, status) => {
    res.writeHead(status, { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain', 'Referrer-Policy': 'no-referrer' });
    res.end(status === 200 ? 'ready' : 'Unavailable');
  };
  const server = http.createServer((req, res) => {
    if (req.url === '/healthz' && req.method === 'GET') {
      return reject(res, service.gateway.server.listening && service.control.listening ? 200 : 503);
    }
    if (req.headers.host !== expectedHost) return reject(res, 400);
    if (req.url === '/__control/launch') {
      req.url = '/launch';
      service.control.emit('request', req, res);
    } else if (req.url?.startsWith('/__control') || req.url?.startsWith('/__gateway/status')) {
      reject(res, 404);
    } else {
      service.gateway.server.emit('request', req, res);
    }
  });
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  server.on('upgrade', (_req, socket) => socket.end('HTTP/1.1 501 Not Implemented\r\nConnection: close\r\nContent-Length: 0\r\n\r\n'));
  return server;
}
